<template>
	<view class="container">
		<view class="header-banner">
			<image :src="hotelImage" mode="aspectFill" class="banner-img"></image>
			<view class="banner-mask">
				<text class="banner-tag"></text>
			</view>
		</view>

		<view class="room-section">
			<view class="list-title">Select Your Room</view>
			
			<view v-for="room in roomList" :key="room.id" class="room-card">
				<image 
					class="room-cover" 
					:src="getRoomImage(room.roomType)" 
					mode="aspectFill"
				></image>
				
				<view class="room-details">
					<view class="details-top">
						<text class="room-name">{{ room.roomType }}</text>
						
						<view class="info-tags">
							<text class="capacity-info">Up to {{ room.maxPeople || 2 }} Guests</text>
							<text class="inventory-info" :class="{'low-stock': (room.totalInventory || 10) < 3}">
								{{ room.totalInventory || 0 }} Rooms Left
							</text>
						</view>

						<view class="feature-tags">
							<text class="f-tag">Free WiFi</text>
							<text class="f-tag">Window</text>
						</view>
					</view>
					
					<view class="details-bottom">
						<view class="price-box">
							<text class="currency">$</text>
							<text class="amount">{{ room.price }}</text>
						</view>
						<button 
							class="book-button" 
							:class="{ 'sold-out': !room.isAvailable || (room.totalInventory || 0) <= 0 }"
							@tap="handleBook(room)"
						>
							{{ (room.isAvailable && (room.totalInventory || 0) > 0) ? 'Book' : 'Full' }}
						</button>
					</view>
				</view>
			</view>
		</view>

		<view v-if="roomList.length === 0" class="empty-state">
			<text>Loading rooms...</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			hotelId: null,
			roomList: [],
			hotelImage: '/static/1.jpg' 
		}
	},
	onLoad(options) {
		if (options.id) {
			this.hotelId = options.id;
			this.hotelImage = `/static/${options.id}.jpg`;
			this.fetchRoomData();
		}
	},
	methods: {
		getRoomImage(type) {
			if (!type) return '/static/logo.png';
			const name = type.toLowerCase();
			if (name.includes('business')) return '/static/1-1.jpg';
			if (name.includes('work')) return '/static/1-2.jpg';
			if (name.includes('queen')) return '/static/2-1.jpg';
			if (name.includes('romantic')) return '/static/2-2.jpg';
			if (name.includes('studio')) return '/static/2-3.jpg';
			if (name.includes('garden')) return '/static/3-1.jpg';
			if (name.includes('twin')) return '/static/3-2.jpg';
			if (name.includes('long')) return '/static/4-1.jpg';
			if (name.includes('space')) return '/static/4-2.jpg';
			if (name.includes('budget')) return '/static/5-1.jpg';
			if (name.includes('bunk')) return '/static/5-2.jpg';
			if (name.includes('student')) return '/static/5-3.jpg';
			return '/static/logo.png';
		},
		fetchRoomData() {
			uni.request({
				url: `http://localhost:8089/api/hotels/${this.hotelId}/rooms`,
				method: 'GET',
				success: (res) => {
					// 确保后端返回了 maxPeople 和 totalInventory 字段 [cite: 52, 54]
					this.roomList = res.data;
				}
			});
		},
		handleBook(room) {
			// 修改点 3：增加库存判断逻辑 
			if (!room.isAvailable || (room.totalInventory || 0) <= 0) return;
			uni.showModal({
				title: 'Confirm Booking',
				content: `Book ${room.roomType} for up to ${room.maxPeople} guests?`,
				success: (res) => {
					if (res.confirm) {
						uni.showToast({ title: 'Success', icon: 'success' });
					}
				}
			});
		}
	}
}
</script>

<style>
/* 保持原有布局，新增详情信息样式 */
.container { background-color: #f8f9fb; min-height: 100vh; }
.header-banner { width: 100%; height: 380rpx; position: relative; }
.banner-img { width: 100%; height: 100%; }
.room-section { padding: 30rpx; }
.list-title { font-size: 34rpx; font-weight: bold; color: #333; margin-bottom: 30rpx; }

.room-card { 
	display: flex; 
	background: #fff; 
	border-radius: 20rpx; 
	padding: 20rpx; 
	margin-bottom: 24rpx; 
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}

.room-cover { 
	width: 220rpx; 
	height: 180rpx; 
	border-radius: 12rpx; 
	flex-shrink: 0; 
}

.room-details { 
	flex: 1; 
	margin-left: 24rpx; 
	display: flex; 
	flex-direction: column; 
	justify-content: space-between; 
}

/* 新增：人数和库存标签布局 */
.info-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-top: 8rpx;
}
.capacity-info {
	font-size: 22rpx;
	color: #666;
	background: #f0f2f5;
	padding: 4rpx 12rpx;
	border-radius: 4rpx;
}
.inventory-info {
	font-size: 22rpx;
	color: #42b983;
	font-weight: bold;
}
.low-stock {
	color: #ff4d4f; /* 库存紧张显示红色  */
}

.room-name { font-size: 30rpx; font-weight: bold; color: #333; }
.feature-tags { display: flex; gap: 10rpx; margin-top: 12rpx; }
.f-tag { font-size: 18rpx; color: #999; border: 1rpx solid #eee; padding: 2rpx 8rpx; border-radius: 4rpx; }

.details-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
.price-box { color: #ff4d4f; }
.currency { font-size: 24rpx; font-weight: bold; }
.amount { font-size: 40rpx; font-weight: bold; margin-left: 4rpx; }

.book-button { 
	background: #42b983; color: #fff; font-size: 24rpx; 
	width: 130rpx; height: 56rpx; line-height: 56rpx; 
	padding: 0; margin: 0; border-radius: 28rpx;
}
.sold-out { background: #ccc !important; }
.empty-state { text-align: center; color: #999; font-size: 26rpx; margin-top: 100rpx; }
</style>