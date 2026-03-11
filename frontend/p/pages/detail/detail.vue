<template>
	<view class="container">
		<view class="hotel-header">
			<image class="hotel-image" :src="hotelImage" mode="aspectFill"></image>
			<view class="hotel-info">
				<text class="hotel-name">{{ hotelName }}</text>
			</view>
		</view>

		<view class="room-list">
			<view v-for="(room, index) in roomList" :key="index" class="room-item" @click="goToRoomDetail(room)">
				<image class="room-thumbnail" :src="getRoomImage(room)" mode="aspectFill"></image>
				
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
					@click.stop="openBookModal(room)"
				>
					{{ room.totalInventory > 0 ? 'Book' : 'Full' }}
				</button>
			</view>
		</view>

		<view v-if="isBookModalShow" class="modal-mask" @tap="isBookModalShow = false">
			<view class="modal-content" @tap.stop>
				<view class="modal-title">Guest Information</view>
				<view class="input-group">
					<view class="input-row">
						<text class="label">Name</text>
						<input class="uni-input" v-model="guestName" placeholder="Full Name" />
					</view>
					<view class="input-row">
						<text class="label">Phone</text>
						<input class="uni-input" type="number" v-model="guestPhone" placeholder="Phone Number" />
					</view>
				</view>
				<view class="modal-btns">
					<button class="cancel-btn" @tap="isBookModalShow = false">Cancel</button>
					<button class="confirm-btn" @tap="handleConfirmBook">Pay & Book</button>
				</view>
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
			roomList: [],
			// 弹窗相关
			isBookModalShow: false,
			selectedRoom: null,
			guestName: '',
			guestPhone: ''
		}
	},
	onLoad(options) {
		this.hotelId = options.id;
		this.hotelImage = `/static/${options.id}.jpg`;
		this.fetchRoomData();
	},
	methods: {
		goToRoomDetail(room) {
			uni.navigateTo({
				url: `/pages/roomDetail/roomDetail?id=${room.id}&hotelId=${this.hotelId}`
			});
		},
		fetchRoomData() {
			uni.request({
				url: `http://localhost:8089/api/hotels/${this.hotelId}/rooms`,
				method: 'GET',
				success: (res) => {
					this.roomList = res.data;
				}
			});
		},
		getRoomImage(room) {
			const rt = room.roomType;
			if (rt.includes('Business')) return '/static/1-11.jpg'; 
			if (rt.includes('Work-friendly')) return '/static/1-22.jpg';
			if (rt.includes('Queen')) return '/static/2-11.jpg';
			if (rt.includes('Romantic')) return '/static/2-22.jpg';
			if (rt.includes('Designer')) return '/static/2-33.jpg';
			if (rt.includes('Family')) return '/static/3-11.jpg';
			if (rt.includes('Child')) return '/static/3-22.jpg';
			if (rt.includes('Studio')) return '/static/4-11.jpg';
			if (rt.includes('Space')) return '/static/4-22.jpg';
			if (rt.includes('Budget')) return '/static/5-11.jpg';
			if (rt.includes('Bunk')) return '/static/5-22.jpg';
			if (rt.includes('Student')) return '/static/5-33.jpg';
			return '/static/logo.png';
		},
		// 打开信息填写弹窗
		openBookModal(room) {
			this.selectedRoom = room;
			this.isBookModalShow = true;
		},
		// 提交预订
		handleConfirmBook() {
			if (!this.guestName || !this.guestPhone) {
				uni.showToast({ title: 'Please complete info', icon: 'none' });
				return;
			}
			
			uni.showLoading({ title: 'Processing...' });
			uni.request({
				url: 'http://localhost:8089/api/orders/book',
				method: 'POST',
				data: {
					userId: 1, // 模拟当前登录用户
					roomId: this.selectedRoom.id,
					status: 'PAID',
					guestName: this.guestName, // 发送至后端保存
					guestPhone: this.guestPhone // 发送至后端保存
				},
				success: (orderRes) => {
					uni.hideLoading();
					if (orderRes.statusCode === 200) {
						uni.showToast({ title: 'Success', icon: 'success' });
						this.isBookModalShow = false;
						this.fetchRoomData(); // 刷新库存
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
}
</script>

<style>
/* 保持原有样式不变 */
.container { padding: 20rpx; background-color: #f5f5f5; min-height: 100vh; }
.hotel-header { background: #fff; border-radius: 15rpx; overflow: hidden; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.hotel-image { width: 100%; height: 400rpx; }
.hotel-info { padding: 20rpx; }
.hotel-name { font-size: 36rpx; font-weight: bold; color: #333; }

.room-list { background: #fff; border-radius: 15rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.room-item { display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 30rpx; border-bottom: 1rpx solid #f0f0f0; }

.room-thumbnail { width: 180rpx; height: 180rpx; border-radius: 12rpx; margin-right: 20rpx; flex-shrink: 0; }
.room-details { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
.room-title-row { display: flex; flex-direction: row; align-items: center; margin-bottom: 12rpx; width: 100%; }
.name-container { flex: 0 0 180rpx; margin-right: 15rpx; }
.room-type { font-size: 28rpx; font-weight: bold; color: #333; }
.room-inventory { font-size: 20rpx; padding: 4rpx 10rpx; border-radius: 6rpx; white-space: nowrap; }
.stock-green { color: #28a745; background: #eafaf1; }
.stock-red { color: #ff4d4f; background: #fff1f0; }
.room-price { font-size: 28rpx; color: #000000; font-weight: bold; margin-bottom: 8rpx; }
.room-max { font-size: 22rpx; color: #999; }

.book-button { background-color: #28a745; color: white; font-size: 24rpx; width: 120rpx; height: 60rpx; line-height: 60rpx; border-radius: 30rpx; margin-left: 15rpx; display: flex; justify-content: center; align-items: center; }
.disabled-btn { background-color: #ccc !important; }

/* 弹窗样式 */
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 999; display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; width: 85%; padding: 40rpx; border-radius: 30rpx; }
.modal-title { font-size: 34rpx; font-weight: bold; text-align: center; margin-bottom: 30rpx; }
.input-row { display: flex; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid #eee; }
.label { width: 120rpx; font-size: 28rpx; color: #333; }
.uni-input { flex: 1; font-size: 28rpx; }
.modal-btns { display: flex; justify-content: space-between; margin-top: 40rpx; }
.cancel-btn { width: 45%; background: #f5f5f5; color: #666; font-size: 28rpx; border-radius: 40rpx; }
.confirm-btn { width: 45%; background: #28a745; color: #fff; font-size: 28rpx; border-radius: 40rpx; }
</style>