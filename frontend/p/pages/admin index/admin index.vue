<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<view class="header">
			<view class="header-content">
				<text class="title">Admin Dashboard</text>
				<text class="subtitle">Manage your assigned hotel assets</text>
			</view>
		</view>

		<view class="content">
			<view v-if="myHotel.id" class="hotel-item" @tap="goToDetail(myHotel.id)">
				<view class="hotel-card">
					<image :src="getHotelImage(myHotel.name)" class="hotel-image" mode="aspectFill"></image>
					<view class="hotel-info">
						<view class="name-row">
							<text class="hotel-name">{{ myHotel.name }}</text>
							<view class="rating">
								<text class="star">★</text>
								<text>{{ myHotel.rating }}</text>
							</view>
						</view>
						<text class="hotel-address">{{ myHotel.address }}</text>
						<view class="tag-container">
							<text class="category-tag">{{ myHotel.category }}</text>
							<view class="manage-btn">Manage Rooms</view>
						</view>
					</view>
				</view>
			</view>

			<view v-else class="empty-state">
				<text>Loading management data...</text>
			</view>
		</view>

		<view class="tabbar-placeholder"></view>
		<view class="tabbar">
			<view class="tab-item active">
				<view class="icon-container">
					<text class="tab-icon">🏠</text>
				</view>
				<text class="tab-label">Home</text>
			</view>
			<view class="tab-item" @tap="goToMine">
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
				myHotel: {},
				isDark: false
			}
		},
		onShow() {
		    this.isDark = uni.getStorageSync('isDarkMode') || false;
		    const userInfo = uni.getStorageSync('userInfo');
		
		    if (userInfo && userInfo.role && userInfo.role.toLowerCase() === 'admin') {
		        this.fetchMyHotel(userInfo.id);
		    } else {
		        // 如果没有登录或者是普通用户，重定向
		        uni.reLaunch({ 
		            url: userInfo ? '/pages/index/index' : '/pages/login/login' 
		        });
		    }
		},
		methods: {
			fetchMyHotel(userId) {
				uni.request({
					url: `http://localhost:8089/api/hotels/admin/${userId}`,
					success: (res) => {
						if (res.statusCode === 200) {
							this.myHotel = res.data;
						}
					}
				});
			},
			goToDetail(id) {
				uni.navigateTo({
					url: `/pages/admin detail/admin detail?id=${id}&isAdmin=true`
				});
			},
			goToMine() {
				uni.reLaunch({ url: '/pages/admin mine/admin mine' });
			},
			getHotelImage(name) {
				if (name?.includes('Hotel A')) return '/static/1.jpg';
				if (name?.includes('Hotel B')) return '/static/2.jpg';
				if (name?.includes('Hotel C')) return '/static/3.jpg';
				if (name?.includes('Hotel D')) return '/static/4.jpg';
				if (name?.includes('Hotel E')) return '/static/5.jpg';
				return '/static/logo.png';
			}
		}
	}
</script>

<style scoped>
	/* Global Container */
	.container { min-height: 100vh; background-color: #f8f9fb; }
	.dark-mode { background-color: #1a1a1a; }

	/* Header Styling matching index.vue */
	.header { padding: 100rpx 40rpx 40rpx; background-color: #ffffff; border-bottom-left-radius: 40rpx; border-bottom-right-radius: 40rpx; }
	.dark-mode .header { background-color: #2c2c2c; }
	.title { font-size: 52rpx; font-weight: 800; color: #1a1a1a; display: block; }
	.subtitle { font-size: 26rpx; color: #888; margin-top: 10rpx; display: block; }
	.dark-mode .title { color: #ffffff; }

	/* Content Styling */
	.content { padding: 40rpx 30rpx; }
	.hotel-card { background: #ffffff; border-radius: 32rpx; overflow: hidden; box-shadow: 0 15rpx 45rpx rgba(0,0,0,0.06); margin-bottom: 40rpx; }
	.dark-mode .hotel-card { background: #2c2c2c; }
	.hotel-image { width: 100%; height: 420rpx; }
	.hotel-info { padding: 30rpx; }
	.name-row { display: flex; justify-content: space-between; align-items: center; }
	.hotel-name { font-size: 40rpx; font-weight: bold; color: #1a1a1a; }
	.dark-mode .hotel-name { color: #ffffff; }
	.rating { display: flex; align-items: center; color: #ff9500; font-weight: bold; font-size: 28rpx; }
	.star { margin-right: 6rpx; }
	.hotel-address { font-size: 26rpx; color: #999; margin: 12rpx 0 24rpx; display: block; }
	
	.tag-container { display: flex; justify-content: space-between; align-items: center; }
	.category-tag { background: #f0f3ff; color: #4c6ef5; padding: 8rpx 24rpx; border-radius: 12rpx; font-size: 24rpx; font-weight: 600; }
	.manage-btn { font-size: 28rpx; color: #4c6ef5; font-weight: bold; border-bottom: 2rpx solid #4c6ef5; }

	/* Custom Tabbar mirroring index.vue native-like look */
	.tabbar-placeholder { height: 120rpx; }
	.tabbar {
		position: fixed; bottom: 0; left: 0; right: 0; height: 110rpx;
		background: #ffffff; display: flex; border-top: 1rpx solid #f0f0f0;
		padding-bottom: env(safe-area-inset-bottom);
		z-index: 1000;
	}
	.dark-mode .tabbar { background: #2c2c2c; border-top-color: #3d3d3d; }
	.tab-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
	.tab-icon { font-size: 44rpx; }
	.tab-label { font-size: 22rpx; color: #bfbfbf; margin-top: 4rpx; }
	.tab-item.active .tab-label { color: #4c6ef5; font-weight: bold; }
	.tab-item.active .tab-icon { filter: drop-shadow(0 0 5rpx rgba(76, 110, 245, 0.3)); }

	.empty-state { text-align: center; padding-top: 200rpx; color: #999; font-size: 28rpx; }
</style>