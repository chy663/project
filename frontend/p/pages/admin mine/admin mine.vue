<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<view class="header-bg">
			<view class="user-card">
				<image class="avatar" src="/static/头像 男孩.png" mode="aspectFill"></image>
				<view class="user-info">
					<text class="username">{{ userInfo.nickname || userInfo.username || 'Please Sign In' }}</text>
					<text class="vip-tag" v-if="userInfo.username">Hotel Administrator</text>
				</view>
			</view>
		</view>

		<view class="content-wrapper">
			<view class="menu-card">
				<view class="menu-item" @tap="handleMenuClick('Account Settings')">
					<view class="item-left">
						<text class="menu-icon">🔒</text>
						<text class="menu-text">Account Security</text>
					</view>
					<text class="arrow">❯</text>
				</view>
				<view class="menu-item" @tap="handleMenuClick('System Settings')">
					<view class="item-left">
						<text class="menu-icon">⚙️</text>
						<text class="menu-text">System Settings</text>
					</view>
					<text class="arrow">❯</text>
				</view>
			</view>

			<view class="logout-btn" @tap="handleLogout">
				<text class="logout-text">Sign Out</text>
			</view>
		</view>

		<view class="tabbar-placeholder"></view>
		<view class="tabbar">
			<view class="tab-item" @tap="goToHome">
				<view class="icon-container">
					<text class="tab-icon">🏠</text>
				</view>
				<text class="tab-label">Home</text>
			</view>
			<view class="tab-item active">
				<view class="icon-container">
					<text class="tab-icon">👤</text>
				</view>
				<text class="tab-label">Profile</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {},
			isDark: false
		}
	},
	onShow() {
		this.isDark = uni.getStorageSync('isDarkMode') || false;
		const userInfo = uni.getStorageSync('userInfo');
		
		console.log("Current User Info:", userInfo);

		if (!userInfo || !userInfo.id) {
			uni.reLaunch({ url: '/pages/login/login' });
			return;
		}

		// Role-based access control
		if (userInfo.role && userInfo.role.toLowerCase() === 'admin') {
			this.userInfo = userInfo;
		} else {
			uni.reLaunch({ url: '/pages/index/index' });
		}
	},
	methods: {
		goToHome() {
			uni.reLaunch({ url: '/pages/admin index/admin index' });
		},
		handleMenuClick(menuName) {
			if (menuName === 'System Settings') {
				uni.navigateTo({ url: '/pages/systemsetting/systemsetting' });
			} else if (menuName === 'Account Settings') { 
				uni.navigateTo({ url: '/pages/accountsetting/accountsetting' });
			}
		},
		handleLogout() {
			uni.showModal({
				title: 'Sign Out',
				content: 'Are you sure?',
				cancelText: 'Yes',
				confirmText: 'No',
				success: (res) => {
					if (res.confirm) {
						// Stay on page
					} else {
						// Logic reversed per your existing code: Cancel = Yes
						uni.removeStorageSync('userInfo');
						uni.reLaunch({ url: '/pages/login/login' });
					}
				}
			});
		}
	}
}
</script>

<style scoped>
.container { background-color: #f5f7fa; min-height: 100vh; padding-bottom: 120rpx; }
.header-bg { background: linear-gradient(135deg, #4c6ef5 0%, #4c6ef5 100%); padding: 120rpx 40rpx 100rpx; border-radius: 0 0 50rpx 50rpx; }
.user-card { display: flex; align-items: center; }
.avatar { width: 130rpx; height: 130rpx; border-radius: 50%; border: 6rpx solid rgba(255, 255, 255, 0.4); background: #fff; }

.user-info { margin-left: 35rpx; color: #fff; display: flex; flex-direction: column; align-items: flex-start; }
.username { font-size: 40rpx; font-weight: bold; }
.vip-tag { font-size: 22rpx; color: #d48806; background-color: #fffbe6; padding: 4rpx 16rpx; border-radius: 30rpx; margin-top: 12rpx; display: inline-block; }

.content-wrapper { margin-top: -60rpx; padding: 0 30rpx; }
.menu-card { background: #fff; border-radius: 24rpx; margin-bottom: 30rpx; padding: 10rpx 30rpx; box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.03); }
.menu-item { display: flex; justify-content: space-between; align-items: center; padding: 35rpx 0; border-bottom: 1rpx solid #f0f0f0; }
.menu-item:last-child { border-bottom: none; }
.item-left { display: flex; align-items: center; }
.menu-icon { margin-right: 20rpx; font-size: 34rpx; }
.menu-text { font-size: 30rpx; color: #333; }
.arrow { color: #ccc; font-size: 24rpx; }

.logout-btn { background: #fff; border-radius: 24rpx; padding: 35rpx 0; display: flex; justify-content: center; margin-top: 40rpx; }
.logout-text { color: #ff4d4f; font-weight: bold; }

.tabbar-placeholder { height: 120rpx; }
.tabbar {
	position: fixed; bottom: 0; left: 0; right: 0; height: 110rpx;
	background: #ffffff; display: flex; border-top: 1rpx solid #f0f0f0;
	padding-bottom: env(safe-area-inset-bottom);
	z-index: 1000;
}
.tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.tab-icon { font-size: 44rpx; }
.tab-label { font-size: 22rpx; color: #bfbfbf; margin-top: 4rpx; }
.tab-item.active .tab-label { color: #4c6ef5; font-weight: bold; }

.dark-mode { background-color: #1a1a1a !important; }
.dark-mode .header-bg { background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%); }
.dark-mode .menu-card, .dark-mode .logout-btn { background: #2c2c2c; }
.dark-mode .menu-text { color: #e0e0e0; }
.dark-mode .menu-item { border-bottom-color: #3d3d3d; }
.dark-mode .tabbar { background: #2c2c2c; border-top-color: #3d3d3d; }
.dark-mode .vip-tag { background-color: #3d3d3d; color: #ffd700; border: 1rpx solid #555; }
</style>