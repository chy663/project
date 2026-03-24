<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<swiper class="room-banner" circular indicator-dots indicator-active-color="#ffffff" autoplay>
			<swiper-item v-for="(img, index) in roomImages" :key="index">
				<image :src="img" mode="aspectFill" class="banner-img"></image>
			</swiper-item>
		</swiper>

		<view class="info-section">
			<view class="title-row">
				<text class="room-name">{{ roomInfo.roomType || 'Room Details' }}</text>
				<view class="price-box">
					<text class="price">${{ roomInfo.price }}</text>
					<text class="unit">/ Night</text>
				</view>
			</view>
			
			<view class="tag-row mb-20">
				<text class="tag-outline" v-if="roomInfo.maxPeople">Max {{ roomInfo.maxPeople }} People</text>
				<text class="tag-outline" :class="roomInfo.totalInventory > 0 ? 'stock-green' : 'stock-red'">
					Stock: {{ roomInfo.totalInventory || 0 }}
				</text>
			</view>

			<view class="facility-row">
				<view class="facility-item"><text class="facility-icon">📶</text><text>Free Wi-Fi</text></view>
				<view class="facility-item"><text class="facility-icon">🍳</text><text>Breakfast</text></view>
				<view class="facility-item"><text class="facility-icon">❄️</text><text>AC</text></view>
				<view class="facility-item"><text class="facility-icon">🚿</text><text>Shower</text></view>
			</view>
		</view>

		<view class="section">
			<view class="section-title">Description</view>
			<text class="description-text">
				This {{ roomInfo.roomType }} is designed for comfort and convenience. 
				It can accommodate up to {{ roomInfo.maxPeople }} guests.
			</text>
		</view>

		<view class="section">
			<view class="section-title">Reviews ({{ reviews.length }})</view>
			<view v-if="reviews.length > 0">
				<view v-for="(rev, index) in reviews" :key="index" class="review-item">
					<view class="review-header">
						<text class="review-user">Guest_{{ rev.userId || '001' }}</text>
						<text class="review-date">{{ formatReviewDate(rev.createTime) }}</text>
					</view>
					<text class="review-content">{{ rev.content }}</text>
				</view>
			</view>
			<view v-else class="no-reviews">No reviews yet.</view>
		</view>

		<view class="bottom-bar">
			<button 
				class="book-now" 
				:class="{'disabled-btn': roomInfo.totalInventory <= 0}"
				:disabled="roomInfo.totalInventory <= 0"
				@tap="openBookModal"
			>
				{{ roomInfo.totalInventory > 0 ? 'Book Now' : 'Full' }}
			</button>
		</view>

		<view v-if="isBookModalShow" class="modal-mask" @tap="isBookModalShow = false">
			<view class="modal-content" @tap.stop>
				<view class="modal-title" style="display: flex; justify-content: space-between; align-items: center;">
					<text>Guest Information</text>
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
// 仅在此处引入并注册了 Mixin
import { themeMixin } from '@/mixins/theme.js';

export default {
	mixins: [themeMixin],
	data() {
		return {
			roomId: null,
			hotelId: null,
			roomInfo: {},
			roomImages: [],
			isBookModalShow: false,
			guestName: '',
			guestPhone: '',
			reviews: [],
			currentUserId: 1
		}
	},
	onLoad(options) {
		this.roomId = options.id;
		this.hotelId = options.hotelId;
		
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo && userInfo.id) {
			this.currentUserId = userInfo.id;
		}
		
		this.fetchRoomDetail();
		this.fetchReviews(); 
		
		uni.$on('onGuestSelect', (guest) => {
			this.guestName = guest.name;
			this.guestPhone = guest.phone;
		});
	},
	onUnload() {
		uni.$off('onGuestSelect');
	},
	methods: {
		fetchRoomDetail() {
			uni.request({
				url: `http://localhost:8089/api/rooms/hotel/${this.hotelId}`,
				method: 'GET',
				success: (res) => {
					const currentRoom = res.data.find(item => item.id == this.roomId);
					if (currentRoom) {
						this.roomInfo = currentRoom;
						this.roomImages = this.getRoomImages(currentRoom);
					}
				}
			});
		},
		fetchReviews() {
			uni.request({
				url: `http://localhost:8089/api/reviews/room/${this.roomId}`,
				method: 'GET',
				success: (res) => {
					this.reviews = res.data;
				}
			});
		},
		formatReviewDate(dateStr) {
			if (!dateStr) return '';
			return dateStr.replace('T', ' ').substring(0, 10);
		},
		getRoomImages(room) {
			let mainImg = '/static/logo.png';
			const rt = room.roomType;
			if (rt.includes('King')) mainImg = '/static/1-11.jpg'; 
			else if (rt.includes('Business')) mainImg = '/static/1-22.jpg'; 
			else if (rt.includes('Family')) mainImg = '/static/2-11.jpg';
			else if (rt.includes('Deluxe')) mainImg = '/static/2-22.jpg';
			else if (rt.includes('Neon')) mainImg = '/static/3-11.jpg';
			else if (rt.includes('Velvet')) mainImg = '/static/3-22.jpg';
			else if (rt.includes('One')) mainImg = '/static/4-22jpg';
			else if (rt.includes('Studio')) mainImg = '/static/4-11.jpg';
			else if (rt.includes('4')) mainImg = '/static/5-11.jpg';
			else if (rt.includes('Double')) mainImg = '/static/5-22.jpg';
			return [mainImg, mainImg, mainImg];
		},
		openBookModal() { this.isBookModalShow = true; },
		goToSelectGuest() {
			uni.navigateTo({
				url: '/pages/guestList/guestList?mode=select'
			});
		},
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
					userId: this.currentUserId,
					roomId: this.roomInfo.id,
					status: 'PAID',
					guestName: this.guestName,
					guestPhone: this.guestPhone
				},
				success: (orderRes) => {
					uni.hideLoading();
					if (orderRes.statusCode === 200) {
						uni.showToast({ title: 'Success' });
						this.isBookModalShow = false;
						setTimeout(() => { uni.switchTab({ url: '/pages/order/order' }); }, 1500);
					}
				}
			});
		}
	}
}
</script>

<style>
/* 以下所有原有样式代码完全保持不变 */
.container { padding-bottom: 140rpx; background-color: #f5f5f5; min-height: 100vh; }
.room-banner { width: 100%; height: 500rpx; background: #fff; }
.banner-img { width: 100%; height: 100%; }
.info-section, .section { background: #fff; padding: 30rpx; margin-top: 20rpx; }
.title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20rpx; }
.room-name { font-size: 38rpx; font-weight: bold; color: #333; }
.price { color: #000000; font-size: 44rpx; font-weight: bold; }
.unit { font-size: 24rpx; color: #999; margin-left: 6rpx; }
.tag-outline { color: #007bff; font-size: 22rpx; padding: 4rpx 16rpx; border-radius: 8rpx; margin-right: 15rpx; border: 1rpx solid #eee; background-color: #e7f1ff; }
.stock-green { color: #28a745; background: #eafaf1; border-color: #28a745; }
.stock-red { color: #ff4d4f; background: #fff1f0; border-color: #ff4d4f; }
.facility-row { display: flex; justify-content: space-between; padding-top: 20rpx; border-top: 1rpx solid #f8f8f8; }
.facility-item { display: flex; flex-direction: column; align-items: center; flex: 1; }
.facility-icon { font-size: 36rpx; margin-bottom: 10rpx; }
.facility-item text:last-child { font-size: 22rpx; color: #666; }
.section-title { font-size: 32rpx; font-weight: bold; margin-bottom: 20rpx; border-left: 8rpx solid #28a745; padding-left: 20rpx; }
.description-text { font-size: 28rpx; color: #666; line-height: 1.6; }

.review-item { padding: 20rpx 0; border-bottom: 1rpx solid #f0f0f0; }
.review-item:last-child { border-bottom: none; }
.review-header { display: flex; justify-content: space-between; margin-bottom: 10rpx; }
.review-user { font-size: 26rpx; color: #333; font-weight: bold; }
.review-date { font-size: 22rpx; color: #999; }
.review-content { font-size: 28rpx; color: #666; }
.no-reviews { text-align: center; color: #ccc; padding: 40rpx 0; font-size: 26rpx; }

.bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; padding: 20rpx 40rpx; box-shadow: 0 -4rpx 10rpx rgba(0,0,0,0.05); }
.book-now { background: #28a745; color: #fff; border-radius: 50rpx; font-weight: bold; }
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 999; display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; width: 85%; padding: 40rpx; border-radius: 30rpx; }
.modal-title { font-size: 34rpx; font-weight: bold; margin-bottom: 30rpx; }
.input-row { display: flex; align-items: center; padding: 20rpx 0; border-bottom: 1rpx solid #eee; }
.label { width: 120rpx; font-size: 28rpx; color: #333; }
.uni-input { flex: 1; font-size: 28rpx; }
.modal-btns { display: flex; justify-content: space-between; margin-top: 40rpx; }
.cancel-btn { width: 45%; background: #f5f5f5; color: #666; font-size: 28rpx; border-radius: 40rpx; }
.confirm-btn { width: 45%; background: #28a745; color: #fff; font-size: 28rpx; border-radius: 40rpx; }

/* 仅在下方新增夜间模式适配代码，不影响上方原有排版 */
.dark-mode { background-color: #1a1a1a !important; }
.dark-mode .info-section, 
.dark-mode .section, 
.dark-mode .bottom-bar, 
.dark-mode .modal-content,
.dark-mode .room-banner { background-color: #2c2c2c !important; }
.dark-mode .room-name, 
.dark-mode .price, 
.dark-mode .section-title, 
.dark-mode .review-user, 
.dark-mode .modal-title { color: #e0e0e0 !important; }
.dark-mode .description-text, 
.dark-mode .review-content, 
.dark-mode .label { color: #888 !important; }
.dark-mode .review-item, 
.dark-mode .input-row { border-bottom-color: #3d3d3d !important; }
.dark-mode .tag-outline { background-color: #3d3d3d !important; border-color: #444 !important; color: #bbb !important; }
.dark-mode .uni-input { color: #ffffff !important; }
.dark-mode .cancel-btn { background-color: #3d3d3d !important; color: #999 !important; }
</style>