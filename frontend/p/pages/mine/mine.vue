<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<view class="header-bg">
			<view class="user-card">
				<image class="avatar" src="/static/头像 男孩.png" mode="aspectFill"></image>
				<view class="user-info">
					<text class="username">{{ userInfo.nickname || userInfo.username || 'Please Sign In' }}</text>
					<text class="vip-tag" v-if="userInfo.username">Gold Member</text>
				</view>
			</view>
		</view>

		<view class="content-wrapper">
			<view class="menu-card">
				<view class="menu-item" @tap="handleMenuClick('My Favorites')">
					<view class="item-left">
						<text class="menu-icon">⭐</text>
						<text class="menu-text">My Favorites</text>
					</view>
					<text class="arrow">❯</text>
				</view>
				<view class="menu-item" @tap="handleMenuClick('Guest Information')">
					<view class="item-left">
						<text class="menu-icon">👥</text>
						<text class="menu-text">Guest Information</text>
					</view>
					<text class="arrow">❯</text>
				</view>
			</view>

			<view class="menu-card">
				<view class="menu-item" @tap="handleMenuClick('Account Settings')">
					<view class="item-left">
						<text class="menu-icon">🔒</text>
						<text class="menu-text">Account Settings</text>
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
	</view>
</template>

<script>
import { themeMixin } from '@/mixins/theme.js';
export default {
	mixins: [themeMixin],
	data() {
		return {
			userInfo: {}
		}
	},
	onShow() {
		this.userInfo = uni.getStorageSync('userInfo') || {};
		// mixin 内部已处理 isDark 状态
	},
	methods: {
		handleMenuClick(menuName) {
			if (menuName === 'My Favorites') {
				uni.navigateTo({ url: '/pages/favorites/favorites' });
			} else if (menuName === 'Guest Information') {
				uni.navigateTo({ url: '/pages/guestList/guestList' });
			} else if (menuName === 'System Settings') {
				uni.navigateTo({ url: '/pages/systemsetting/systemsetting' });
			} else if (menuName === 'Account Settings') { 
                uni.navigateTo({ url: '/pages/accountsetting/accountsetting' });
            }
			else {
				uni.showToast({ title: `Navigating to ${menuName}`, icon: 'none' });
			}
		},
		handleLogout() {
			uni.showModal({
				title: 'Sign Out',
				content: 'Are you sure?',
				cancelText: 'Yes',
				cancelColor: '#42b983',
				confirmText: 'No',
				success: (res) => {
					if (res.cancel) {
						uni.removeStorageSync('userInfo');
						uni.reLaunch({ url: '/pages/login/login' });
					}
				}
			});
		}
	}
}
</script>

<style>
.container { background-color: #f5f7fa; min-height: 100vh; transition: background-color 0.3s; }
.header-bg { background: linear-gradient(135deg, #42b983 0%, #32a071 100%); padding: 120rpx 40rpx 100rpx; border-radius: 0 0 50rpx 50rpx; }
.user-card { display: flex; align-items: center; }
.avatar { width: 130rpx; height: 130rpx; border-radius: 50%; border: 6rpx solid rgba(255, 255, 255, 0.4); background: #fff; }

/* 修改点：设置 flex 布局方向为纵向，使子元素垂直堆叠 */
.user-info { 
	margin-left: 35rpx; 
	color: #fff; 
	display: flex; 
	flex-direction: column; 
	align-items: flex-start; 
}

.username { font-size: 40rpx; font-weight: bold; }

/* 修改点：调整标签样式，使其更自然地显示在名字下方 */
.vip-tag { 
	font-size: 22rpx; 
	color: #d48806; 
	background-color: #fffbe6; 
	padding: 4rpx 16rpx; 
	border-radius: 30rpx; 
	margin-top: 12rpx; 
	display: inline-block; 
}

.content-wrapper { margin-top: -60rpx; padding: 0 30rpx; }
.menu-card { background: #fff; border-radius: 24rpx; margin-bottom: 30rpx; padding: 10rpx 30rpx; box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.03); }
.menu-item { display: flex; justify-content: space-between; align-items: center; padding: 35rpx 0; border-bottom: 1rpx solid #f0f0f0; }
.menu-item:last-child { border-bottom: none; }
.menu-text { font-size: 30rpx; color: #333; }
.logout-btn { background: #fff; border-radius: 24rpx; padding: 35rpx 0; display: flex; justify-content: center; margin-top: 40rpx; }
.logout-text { color: #ff4d4f; font-weight: bold; }

/* 暗色模式适配 */
.dark-mode { background-color: #1a1a1a !important; }
.dark-mode .header-bg { background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%); }
.dark-mode .menu-card, .dark-mode .logout-btn { background: #2c2c2c; }
.dark-mode .menu-text { color: #e0e0e0; }
.dark-mode .menu-item { border-bottom-color: #3d3d3d; }
.dark-mode .vip-tag { background-color: #3d3d3d; color: #ffd700; border: 1rpx solid #555; }
</style>