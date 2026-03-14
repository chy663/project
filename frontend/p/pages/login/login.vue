<template>
	<view class="container">
		<view class="login-card">
			<view class="title">{{ isRegister ? 'Register Account' : 'Welcome!' }}</view>
			
			<view class="input-group">
				<input class="input" v-model="form.username" placeholder="Username" />
				
				<view class="password-wrapper">
					<input 
						v-if="!showPassword" 
						key="pwd"
						type="password"
						class="input password-input" 
						v-model="form.password" 
						placeholder="Password"
					/>
					
					<input 
						v-else 
						key="txt"
						type="text"
						class="input password-input" 
						v-model="form.password" 
						placeholder="Password"
					/>
					
					<view class="eye-icon-btn" @tap="handleToggle">
						<image 
							:src="showPassword ? '/static/可视密码.png' : '/static/隐藏密码.png'" 
							class="eye-img"
							mode="aspectFit"
						></image>
					</view>
				</view>

				<input v-if="isRegister" class="input" v-model="form.nickname" placeholder="Enter name" />
			</view>

			<button class="submit-btn" @tap="handleSubmit">{{ isRegister ? 'Register' : 'Log in' }}</button>
			
			<view class="switch-text" @tap="toggleMode">
				{{ isRegister ? 'Already have an account? Click to log in' : 'No account? Click to register' }}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isRegister: false,
			showPassword: false,
			form: {
				username: '',
				password: '',
				nickname: ''
			}
		}
	},
	methods: {
		// 切换登录/注册模式时清空表单
		toggleMode() {
			this.isRegister = !this.isRegister;
			this.form.username = '';
			this.form.password = '';
			this.form.nickname = '';
		},
		handleToggle() {
			const currentPwd = this.form.password;
			this.showPassword = !this.showPassword;
			this.$nextTick(() => {
				this.form.password = currentPwd;
			});
		},
		handleSubmit() {
			if (!this.form.username || !this.form.password) {
				return uni.showToast({ title: 'Please fill all fields', icon: 'none' });
			}
			
			const url = this.isRegister ? '/api/users/register' : '/api/users/login';
			
			uni.request({
				url: 'http://localhost:8089' + url,
				method: 'POST',
				data: this.form,
				success: (res) => {
					if (res.statusCode === 200) {
						if (this.isRegister) {
							uni.showToast({ title: 'Register Success!' });
							// 注册成功后自动切换到登录模式
							this.isRegister = false;
						} else {
							// 登录成功
							const userInfo = res.data;
							uni.setStorageSync('userInfo', userInfo);
							uni.showToast({ title: 'Login Success' });
							
							// 根据角色跳转
							setTimeout(() => {
								if (userInfo.role === 'ADMIN') {
									// 管理员跳转至管理后台
									uni.reLaunch({
										url: '/pages/admin index/admin index'
									});
								} else {
									// 普通用户跳转至首页（Tabbar页面通常用 switchTab）
									uni.switchTab({
										url: '/pages/index/index'
									});
								}
							}, 1500);
						}
					} else {
						// 处理 401 或 400 错误
						uni.showToast({ 
							title: res.data || 'Operation Failed', 
							icon: 'none' 
						});
					}
				},
				fail: () => {
					uni.showToast({ title: 'Server Error', icon: 'none' });
				}
			});
		}
	}
}
</script>

<style>
.container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5; }
.login-card { width: 80%; background: #fff; padding: 60rpx 40rpx; border-radius: 20rpx; box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.1); }
.title { font-size: 40rpx; font-weight: bold; margin-bottom: 60rpx; text-align: center; }
.input { height: 90rpx; border-bottom: 1px solid #eee; margin-bottom: 30rpx; width: 100%; font-size: 28rpx; }

.password-wrapper { position: relative; width: 100%; }
.password-input { padding-right: 80rpx; box-sizing: border-box; }
.eye-icon-btn { position: absolute; right: 0; top: 0; height: 90rpx; width: 80rpx; display: flex; align-items: center; justify-content: center; z-index: 100; }
.eye-img { width: 40rpx; height: 40rpx; }

.submit-btn { background: #28a745; color: #fff; border-radius: 50rpx; margin-top: 40rpx; font-size: 32rpx; }
.switch-text { text-align: center; margin-top: 30rpx; color: #007bff; font-size: 26rpx; }
</style>