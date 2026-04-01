<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<view class="hotel-header">
			<image class="hotel-image" :src="hotelImage" mode="aspectFill"></image>
			<view class="hotel-info">
				<text class="hotel-name">{{ hotelName }}</text>
			</view>
		</view>

		<view class="description-section">
			<view class="section-title">Description</view>
			<text class="description-content">{{ hotelDescription || 'No description available.' }}</text>
		</view>

		<view class="room-list">
			<view v-for="(room, index) in roomList" :key="index" class="room-item" @click="goToRoomDetail(room)">
				<image class="room-thumbnail" :src="getRoomImage(room)" mode="aspectFill"></image>
				
				<view class="room-details">
					<view class="room-title-row">
						<view class="name-container">
							<text class="room-type">{{ room.roomType }}</text>
						</view>
					</view>
					
					<text class="room-price">${{ room.price }} / Night</text>
					<text class="room-max">Max People: {{ room.maxPeople }}</text>
				</view>
				
				<view class="action-col">
					<image 
						class="fav-icon" 
						:src="(favoriteRoomIds || []).includes(Number(room.id)) ? '/static/已收藏.png' : '/static/收藏.png'" 
						@click.stop="toggleFavorite(room)"
					></image>
					<button 
						class="book-button action-btn-override" 
						@click.stop="openBookModal(room)"
					>
						Book
					</button>
				</view>
			</view>
		</view>

		<view v-if="isBookModalShow" class="modal-mask" @tap="isBookModalShow = false">
			<view class="modal-content" @tap.stop>
				<view class="modal-title" style="display: flex; justify-content: space-between; align-items: center;">
					<text>Booking Information</text>
					<text style="font-size: 24rpx; color: #007bff; font-weight: normal;" @tap="goToSelectGuest">Choose Existed Info</text>
				</view>
				<view class="input-group">
					<view class="input-row">
						<text class="label">Name</text>
						<input class="uni-input" v-model="guestName" placeholder="Full Name" />
					</view>
					<view class="input-row">
						<text class="label">Phone</text>
						<input class="uni-input" type="number" v-model="guestPhone" placeholder="Phone Number" />
					</view>
					<view class="input-row">
						<text class="label">Check-in</text>
						<picker mode="date" :value="startDate" :start="today" @change="onStartDateChange">
							<view class="uni-input">{{ startDate || 'Select Date' }}</view>
						</picker>
					</view>
					<view class="input-row">
						<text class="label">Check-out</text>
						<picker mode="date" :value="endDate" :start="startDate || today" @change="onEndDateChange">
							<view class="uni-input">{{ endDate || 'Select Date' }}</view>
						</picker>
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
import { themeMixin } from '@/mixins/theme.js';
export default {
	mixins: [themeMixin],
	data() {
		return {
			hotelId: null,
			hotelName: 'Hotel Details',
			hotelDescription: '', 
			hotelImage: '/static/1.jpg',
			roomList: [],
			isBookModalShow: false,
			selectedRoom: null,
			guestName: '',
			guestPhone: '',
			startDate: '',
			endDate: '',
			today: new Date().toISOString().split('T')[0],
			favoriteRoomIds: [],
			currentUserId: 1 
		}
	},
	onLoad(options) {
		this.hotelId = options.id;
		this.hotelImage = `/static/${options.id}.jpg`;
		this.startDate = options.startDate || this.today;
		this.endDate = options.endDate || '';
		
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo && userInfo.id) {
			this.currentUserId = userInfo.id;
		}
		
		this.fetchHotelDetail(); 
		this.fetchRoomData();
		this.fetchFavoriteRoomIds(); 
		
		uni.$on('onGuestSelect', (guest) => {
			this.guestName = guest.name;
			this.guestPhone = guest.phone;
		});
	},
	onUnload() {
		uni.$off('onGuestSelect');
	},
	methods: {
		onStartDateChange(e) {
			this.startDate = e.detail.value;
			if (this.endDate && this.endDate <= this.startDate) {
				this.endDate = '';
			}
			this.fetchRoomData();
		},
		onEndDateChange(e) {
			this.endDate = e.detail.value;
			this.fetchRoomData();
		},
		fetchHotelDetail() {
			uni.request({
				url: `http://localhost:8089/api/hotels/${this.hotelId}`,
				method: 'GET',
				success: (res) => {
					if (res.statusCode === 200 && res.data) {
						this.hotelName = res.data.name;
						this.hotelDescription = res.data.description;
					}
				}
			});
		},
		goToRoomDetail(room) {
			uni.navigateTo({
				url: `/pages/roomDetail/roomDetail?id=${room.id}&hotelId=${this.hotelId}&startDate=${this.startDate}&endDate=${this.endDate}`
			});
		},
		fetchRoomData() {
			uni.request({
				url: `http://localhost:8089/api/rooms/hotel/${this.hotelId}`,
				method: 'GET',
				data: {
					startDate: this.startDate,
					endDate: this.endDate
				},
				success: (res) => {
					this.roomList = res.data;
				}
			});
		},
		fetchFavoriteRoomIds() {
			uni.request({
				url: `http://localhost:8089/api/favorites/user/${this.currentUserId}/roomIds`,
				method: 'GET',
				success: (res) => {
					if (res.statusCode === 200) {
						this.favoriteRoomIds = Array.isArray(res.data) ? res.data : [];
					} else {
						this.favoriteRoomIds = [];
					}
				}
			});
		},
		toggleFavorite(room) {
			uni.request({
				url: 'http://localhost:8089/api/favorites/toggle',
				method: 'POST',
				data: {
					userId: this.currentUserId,
					roomId: room.id
				},
				success: (res) => {
					if (res.statusCode === 200) {
						uni.showToast({ title: res.data === 'Added' ? 'Collected' : 'Removed', icon: 'none' });
						this.fetchFavoriteRoomIds(); 
					}
				}
			});
		},
		getRoomImage(room) {
			if (!room || !room.roomType) return '/static/logo.png';
			const rt = room.roomType;
			if (rt.includes('King')) return '/static/1-11.jpg'; 
			if (rt.includes('Business')) return '/static/1-22.jpg';
			if (rt.includes('Family')) return '/static/2-11.jpg';
			if (rt.includes('Deluxe')) return '/static/2-22.jpg';
			if (rt.includes('Neon')) return '/static/3-11.jpg';
			if (rt.includes('Velvet')) return '/static/3-22.jpg';
			if (rt.includes('One')) return '/static/4-11.jpg';
			if (rt.includes('Studio')) return '/static/4-22.jpg';
			if (rt.includes('4')) return '/static/5-11.jpg';
			if (rt.includes('Double')) return '/static/5-22.jpg';
			return '/static/logo.png';
		},
		openBookModal(room) {
			this.selectedRoom = room;
			this.isBookModalShow = true;
		},
		goToSelectGuest() {
			uni.navigateTo({
				url: '/pages/guestList/guestList?mode=select'
			});
		},
		handleConfirmBook() {
			if (!this.guestName || !this.guestPhone || !this.startDate || !this.endDate) {
				uni.showToast({ title: 'Please complete all info', icon: 'none' });
				return;
			}
			
			uni.showLoading({ title: 'Processing...' });
			uni.request({
				url: 'http://localhost:8089/api/orders',
				method: 'POST',
				data: {
					userId: this.currentUserId, 
					roomId: this.selectedRoom.id,
					hotelId: this.hotelId,
					status: 'PAID',
					guestName: this.guestName, 
					guestPhone: this.guestPhone,
					checkInDate: this.startDate,
					checkOutDate: this.endDate,
					totalPrice: this.selectedRoom.price
				},
				success: (orderRes) => {
					uni.hideLoading();
					if (orderRes.statusCode === 200) {
						uni.showToast({ title: 'Success', icon: 'success' });
						this.isBookModalShow = false;
						this.fetchRoomData(); 
						setTimeout(() => {
							uni.switchTab({ url: '/pages/order/order' });
						}, 1500);
					} else {
						// Error logic: if stock is insufficient, backend usually returns 400 or specific message
						uni.showToast({ title: 'Room inventory is full for the selected dates', icon: 'none', duration: 2500 });
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

.description-section { background-color: #fff; padding: 25rpx; border-radius: 15rpx; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.section-title { font-size: 30rpx; font-weight: bold; color: #333; margin-bottom: 10rpx; }
.description-content { font-size: 26rpx; color: #666; line-height: 1.5; }

.room-list { background: #fff; border-radius: 15rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.room-item { display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 30rpx; border-bottom: 1rpx solid #f0f0f0; }

.room-thumbnail { width: 180rpx; height: 180rpx; border-radius: 12rpx; margin-right: 20rpx; flex-shrink: 0; }
.room-details { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
.room-title-row { display: flex; flex-direction: row; align-items: center; margin-bottom: 12rpx; width: 100%; }
.name-container { flex: 0 0 180rpx; margin-right: 15rpx; }
.room-type { font-size: 28rpx; font-weight: bold; color: #333; }
.room-price { font-size: 28rpx; color: #000000; font-weight: bold; margin-bottom: 8rpx; }
.room-max { font-size: 22rpx; color: #999; }

.book-button { background-color: #28a745; color: white; font-size: 24rpx; width: 120rpx; height: 60rpx; line-height: 60rpx; border-radius: 30rpx; margin-left: 15rpx; display: flex; justify-content: center; align-items: center; }

.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 999; display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; width: 85%; padding: 40rpx; border-radius: 30rpx; }
.modal-title { font-size: 34rpx; font-weight: bold; margin-bottom: 30rpx; }
.input-row { display: flex; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid #eee; }
.label { width: 140rpx; font-size: 28rpx; color: #333; }
.uni-input { flex: 1; font-size: 28rpx; height: 40rpx; line-height: 40rpx; }
.modal-btns { display: flex; justify-content: space-between; margin-top: 40rpx; }
.cancel-btn { width: 45%; background: #f5f5f5; color: #666; font-size: 28rpx; border-radius: 40rpx; }
.confirm-btn { width: 45%; background: #28a745; color: #fff; font-size: 28rpx; border-radius: 40rpx; }

.action-col { display: flex; flex-direction: column; align-items: center; justify-content: center; margin-left: 15rpx; }
.fav-icon { width: 50rpx; height: 50rpx; margin-bottom: 15rpx; transition: transform 0.2s; }
.fav-icon:active { transform: scale(1.2); }
.action-btn-override { margin-left: 0 !important; } 

.dark-mode { background-color: #1a1a1a !important; }
.dark-mode .hotel-header, .dark-mode .room-list, .dark-mode .modal-content, .dark-mode .description-section { background-color: #2c2c2c !important; }
.dark-mode .hotel-name, .dark-mode .room-type, .dark-mode .room-price, .dark-mode .modal-title, .dark-mode .section-title { color: #e0e0e0 !important; }
.dark-mode .description-content { color: #bbb !important; }
.dark-mode .room-item, .dark-mode .input-row { border-bottom-color: #3d3d3d !important; }
.dark-mode .room-max, .dark-mode .label { color: #888 !important; }
.dark-mode .uni-input { color: #ffffff !important; }
.dark-mode .cancel-btn { background-color: #3d3d3d !important; color: #999 !important; }
</style>