<template>
	<view class="container">
		<view class="hotel-header">
			<image class="hotel-image" :src="hotelImage" mode="aspectFill"></image>
			<view class="hotel-info">
				<text class="hotel-name">{{ hotelName }}</text>
			</view>
		</view>

		<view class="room-list">
			<view v-for="(room, index) in roomList" :key="index" class="room-item">
				<view class="room-details">
					<view class="room-title-row">
						<view class="name-container">
							<text class="room-type">{{ room.roomType }}</text>
						</view>
						<view class="stock-container">
							<text class="room-inventory" :class="room.totalInventory > 0 ? 'stock-green' : 'stock-red'">
								Stock: {{ room.totalInventory || 0 }}
							</text>
						</view>
					</view>
					
					<text class="room-price">${{ room.price }} / Night</text>
					
					<text class="room-max">Max People: {{ room.maxPeople }}</text>
				</view>
				
				<button 
					class="book-button" 
					:class="{'disabled-btn': room.totalInventory <= 0}"
					:disabled="room.totalInventory <= 0"
					@click="handleBook(room)"
				>
					{{ room.totalInventory > 0 ? 'Book' : 'Full' }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			hotelId: null,
			hotelName: 'Hotel Details',
			hotelImage: '/static/1.jpg',
			roomList: []
		}
	},
	onLoad(options) {
		this.hotelId = options.id;
		this.hotelImage = `/static/${options.id}.jpg`;
		this.fetchRoomData();
	},
	methods: {
		fetchRoomData() {
			uni.request({
				url: `http://localhost:8089/api/hotels/${this.hotelId}/rooms`,
				method: 'GET',
				success: (res) => {
					this.roomList = res.data;
				}
			});
		},
		handleBook(room) {
			if (!room.totalInventory || room.totalInventory <= 0) return;

			uni.showModal({
				title: 'Confirm Booking',
				content: `Total: $${room.price}. Confirm payment for ${room.roomType}?`,
				confirmText: 'Pay',
				cancelText: 'Cancel',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: 'Processing...' });
						uni.request({
							url: 'http://localhost:8089/api/orders/book',
							method: 'POST',
							data: {
								userId: 1,
								roomId: room.id,
								status: 'PAID'
							},
							success: (orderRes) => {
								uni.hideLoading();
								if (orderRes.statusCode === 200) {
									uni.showToast({ title: 'Success', icon: 'success' });
									this.fetchRoomData();
									setTimeout(() => {
										uni.switchTab({ url: '/pages/order/order' });
									}, 1500);
								} else {
									uni.showToast({ title: 'Failed', icon: 'none' });
								}
							}
						});
					}
				}
			});
		}
	}
}
</script>

<style>
.container { padding: 20rpx; background-color: #f5f5f5; min-height: 100vh; }
.hotel-header { background: #fff; border-radius: 15rpx; overflow: hidden; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.hotel-image { width: 100%; height: 400rpx; }
.hotel-info { padding: 20rpx; }
.hotel-name { font-size: 36rpx; font-weight: bold; color: #333; }

.room-list { background: #fff; border-radius: 15rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.room-item { 
	display: flex; 
	flex-direction: row; 
	justify-content: space-between; 
	align-items: center; 
	padding: 30rpx; 
	border-bottom: 1rpx solid #f0f0f0; 
}

.room-details { 
	flex: 1; 
	display: flex; 
	flex-direction: column; 
	align-items: flex-start;
}

.room-title-row { 
	display: flex; 
	flex-direction: row; 
	align-items: center; 
	margin-bottom: 12rpx;
	width: 100%;
}

.name-container {
	flex: 0 0 240rpx; 
	margin-right: 20rpx;
}
.room-type { 
	font-size: 32rpx; 
	font-weight: bold; 
	color: #333; 
}

.stock-container {
	flex: 1; 
}
.room-inventory { 
	font-size: 22rpx; 
	padding: 4rpx 12rpx; 
	border-radius: 6rpx; 
	white-space: nowrap; 
}

/* Green Stock Style (>0) */
.stock-green { 
	color: #28a745; 
	background: #eafaf1; 
}

/* Red Stock Style (==0) */
.stock-red { 
	color: #ff4d4f; 
	background: #fff1f0; 
}

.room-price { 
	font-size: 30rpx; 
	color: #ff5a5f; 
	font-weight: bold; 
	margin-bottom: 8rpx; 
}
.room-max { 
	font-size: 24rpx; 
	color: #999; 
}

/* Updated Button Color to Green */
.book-button { 
	background-color: #28a745; /* Green */
	color: white; 
	font-size: 26rpx; 
	width: 150rpx; 
	height: 70rpx; 
	line-height: 70rpx; 
	border-radius: 35rpx; 
	margin-left: 20rpx;
	flex-shrink: 0;
	padding: 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

/* Disabled/Full button remains grey */
.disabled-btn { 
	background-color: #ccc !important; 
}
</style>