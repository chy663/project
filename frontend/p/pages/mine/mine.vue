<template>
	<view class="container">
		<view class="user-card">
			<image 
				class="avatar" 
				src="/static/头像 男孩.png" 
				mode="aspectFill"
			></image>
			
			<view class="user-info">
				<text class="username">Guest_001</text>
				<text class="vip-tag">Gold Member</text>
			</view>
		</view>

		<view class="menu-list">
			<view class="menu-item">
				<text class="menu-text">My Favorites</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item">
				<text class="menu-text">Common Guests</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item">
				<text class="menu-text">Coupons</text>
				<text class="arrow">></text>
			</view>
		</view>

		<view class="menu-list">
			<view class="menu-item logout" @tap="handleLogout">
				<text class="menu-text">Sign Out</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 这里不再需要头像相关的变量
		}
	},
	methods: {
		handleLogout() {
			uni.showModal({
				title: 'Sign Out',
				content: 'Are you sure you want to log out?',
				confirmColor: '#42b983', // 沿用首页的绿色
				success: (res) => {
					if (res.confirm) {
						uni.showToast({ title: 'Logged out', icon: 'none' });
					}
				}
			});
		}
	}
}
</script>

<style>
/* 样式调整：确保布局清爽且不可交互感明显 */
.container { padding-top: 0; background-color: #f8f8f8; min-height: 100vh; }

.user-card { 
	display: flex; 
	align-items: center; 
	background: #42b983; /* 沿用首页主题色 */
	padding: 100rpx 40rpx 60rpx; 
	border-radius: 0 0 40rpx 40rpx; 
	margin-bottom: 30rpx;
}

.avatar { 
	width: 120rpx; 
	height: 120rpx; 
	border-radius: 60rpx; 
	border: 4rpx solid #fff; 
	background: #fff; 
	flex-shrink: 0;
}

.user-info { margin-left: 30rpx; color: #fff; }
.username { font-size: 36rpx; font-weight: bold; display: block; }
.vip-tag { 
	font-size: 22rpx; 
	background: rgba(255,255,255,0.2); 
	padding: 4rpx 12rpx; 
	border-radius: 20rpx; 
	margin-top: 10rpx; 
	display: inline-block; 
}

.menu-list { background: #fff; border-radius: 16rpx; margin: 0 20rpx 20rpx; overflow: hidden; }
.menu-item { 
	display: flex; 
	align-items: center; 
	padding: 35rpx 30rpx; 
	border-bottom: 1rpx solid #f8f8f8; 
}
.menu-item:last-child { border-bottom: none; }
.menu-text { flex: 1; font-size: 30rpx; color: #333; }
.arrow { color: #ccc; font-size: 24rpx; }

.logout { justify-content: center; }
.logout .menu-text { color: #ff4d4f; flex: none; font-weight: bold; }
</style>