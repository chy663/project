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
			
			<view class="switch-text" @tap="isRegister = !isRegister">
				{{ isRegister ? 'Click to log in' : 'Click to register' }}
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
		handleToggle() {
			// 这种写法能强制触发 Vue 的 DOM 重新计算
			const currentPwd = this.form.password;
			this.showPassword = !this.showPassword;
			
			// 即使数据没变，赋值操作也能触发一次双向绑定的刷新
			this.$nextTick(() => {
				this.form.password = currentPwd;
			});
		},
		handleSubmit() {
			if (!this.form.username || !this.form.password) {
				return uni.showToast({ title: 'Fill the form', icon: 'none' });
			}
			const url = this.isRegister ? '/api/users/register' : '/api/users/login';
			uni.request({
				url: 'http://localhost:8089' + url,
				method: 'POST',
				data: this.form,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.showToast({ title: 'Success' });
						uni.setStorageSync('userInfo', res.data);
						if (this.isRegister) {
							this.isRegister = false;
						} else {
							setTimeout(() => uni.switchTab({ url: '/pages/index/index' }), 1500);
						}
					} else {
						uni.showToast({ title: 'Failed', icon: 'none' });
					}
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
.input { height: 90rpx; border-bottom: 1px solid #eee; margin-bottom: 30rpx; width: 100%; }

.password-wrapper { position: relative; width: 100%; }
.password-input { padding-right: 80rpx; box-sizing: border-box; }
.eye-icon-btn { position: absolute; right: 0; top: 0; height: 90rpx; width: 80rpx; display: flex; align-items: center; justify-content: center; z-index: 100; }
.eye-img { width: 40rpx; height: 40rpx; }

.submit-btn { background: #28a745; color: #fff; border-radius: 50rpx; margin-top: 40rpx; }
.switch-text { text-align: center; margin-top: 30rpx; color: #007bff; font-size: 26rpx; }
</style>