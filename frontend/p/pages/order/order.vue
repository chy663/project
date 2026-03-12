<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<view class="tabs-bar" :class="'active-' + currentTab.toLowerCase()">
			<view 
				v-for="(tab, index) in tabs" 
				:key="index" 
				class="tab-item" 
				:class="{ active: currentTab === tab.value }"
				@tap="switchTab(tab.value)"
			>
				{{ tab.name }}
				<view class="active-line" v-if="currentTab === tab.value"></view>
			</view>
		</view>

		<view v-if="filteredOrderList.length > 0" class="order-list">
			<view v-for="(order, index) in filteredOrderList" :key="index" class="order-card">
				<view class="order-header">
					<text class="hotel-name">{{ order.hotelName }}</text>
					<view class="status-tag" :class="getStatusClass(order.status)">
						{{ order.status }}
					</view>
				</view>

				<view class="order-body">
					<view class="room-info">
						<text class="room-type">{{ order.roomType }}</text>
						<text class="order-price">${{ order.totalPrice }}</text>
					</view>
					
					<view class="guest-details-box">
						<view class="info-line">
							<text class="info-label">Guest Name:</text>
							<text class="info-value">{{ order.guestName || 'N/A' }}</text>
						</view>
						<view class="info-line">
							<text class="info-label">Phone Num:</text>
							<text class="info-value">{{ order.guestPhone || 'N/A' }}</text>
						</view>
					</view>
					
					<view class="order-time">
						Ordered at: {{ formatTime(order) }}
					</view>
				</view>

				<view class="order-footer">
					<template v-if="order.status === 'PAID'">
						<button class="action-btn cancel" @tap="handleCancel(order.id)">Cancel</button>
						<button class="action-btn complete" @tap="handleComplete(order.id)">Check In</button>
					</template>
					<template v-if="order.status === 'COMPLETED'">
						<button class="action-btn review-btn" @tap="openReviewModal(order)">Review</button>
					</template>
				</view>
			</view>
		</view>

		<view v-else class="empty-state">
			<image src="/static/logo.png" mode="aspectFit" class="empty-img"></image>
			<text>No {{ currentTab.toLowerCase() }} orders found.</text>
		</view>

		<view v-if="isReviewModalShow" class="modal-mask" @tap="isReviewModalShow = false">
			<view class="modal-content" @tap.stop>
				<view class="modal-title">Room Review</view>
				<view class="input-group">
					<textarea 
						class="review-textarea" 
						v-model="reviewContent" 
						placeholder="How was your stay?" 
					/>
				</view>
				<view class="modal-btns">
					<button class="cancel-btn" @tap="isReviewModalShow = false">Cancel</button>
					<button class="confirm-btn" @tap="submitReview">Post</button>
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
			userId: 1, 
			orderList: [],
			currentTab: 'PAID', 
			tabs: [
				{ name: 'Paid', value: 'PAID' },
				{ name: 'Completed', value: 'COMPLETED' },
				{ name: 'Cancelled', value: 'CANCELLED' }
			],
			isReviewModalShow: false,
			reviewContent: '',
			selectedOrder: null
		}
	},
	computed: {
		filteredOrderList() {
			return this.orderList.filter(order => order.status === this.currentTab);
		}
	},
	onShow() {
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo && userInfo.id) {
			this.userId = userInfo.id;
		}
		this.fetchOrders();
	},
	methods: {
		fetchOrders() {
			uni.request({
				url: `http://localhost:8089/api/orders?userId=${this.userId}`,
				method: 'GET',
				success: (res) => {
					this.orderList = res.data.reverse();
				}
			});
		},
		switchTab(value) {
			this.currentTab = value;
		},
		getStatusClass(status) {
			if (status === 'PAID') return 'tag-paid';
			if (status === 'COMPLETED') return 'tag-completed';
			return 'tag-cancelled';
		},
		formatTime(order) {
			return order.createTime ? order.createTime.replace('T', ' ').substring(0, 16) : '2026-03-11 14:00';
		},
		handleCancel(orderId) {
		    uni.showModal({
		        title: 'Cancel Order', 
				content: 'Are you sure?',
				// 修改点：左边 Yes (绿色)，右边 No
				cancelText: 'Yes',
				cancelColor: '#28a745', 
				confirmText: 'No',
				confirmColor: '#000000',
		        success: (res) => {
					// 注意：由于 Yes 变成了取消键，点击 Yes 会触发 res.cancel
		            if (res.cancel) {
		                uni.request({
		                    url: `http://localhost:8089/api/orders/${orderId}/cancel`,
		                    method: 'POST',
		                    success: () => { 
								uni.showToast({ title: 'Order Cancelled', icon: 'none' });
								this.fetchOrders(); 
							}
		                });
		            }
		        }
		    });
		},
		handleComplete(orderId) {
			uni.request({
				url: `http://localhost:8089/api/orders/${orderId}/complete`,
				method: 'POST',
				success: () => {
					uni.showToast({ title: 'Checked In' });
					this.fetchOrders();
				}
			});
		},
		openReviewModal(order) {
			this.selectedOrder = order;
			this.reviewContent = '';
			this.isReviewModalShow = true;
		},
		submitReview() {
			if (!this.reviewContent.trim()) {
				uni.showToast({ title: 'Please enter review', icon: 'none' });
				return;
			}
			uni.request({
				url: 'http://localhost:8089/api/reviews/add',
				method: 'POST',
				data: {
					userId: this.userId,
					roomId: this.selectedOrder.roomId,
					content: this.reviewContent
				},
				success: () => {
					uni.showToast({ title: 'Success' });
					this.isReviewModalShow = false;
				}
			});
		}
	}
}
</script>

<style>
.container { padding-top: 100rpx; background-color: #f8f8f8; min-height: 100vh; display: flex; flex-direction: column; }
.tabs-bar { position: fixed; top: 0; left: 0; right: 0; height: 90rpx; background: #fff; display: flex; justify-content: space-around; align-items: center; z-index: 99; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.tab-item { font-size: 28rpx; color: #666; position: relative; height: 100%; display: flex; align-items: center; transition: all 0.3s; }
.tab-item.active { font-weight: bold; }
.active-line { position: absolute; bottom: 0; left: 20%; right: 20%; height: 6rpx; border-radius: 4rpx; transition: all 0.3s; }
.active-paid .tab-item.active { color: #28a745; }
.active-paid .active-line { background: #28a745; }
.active-completed .tab-item.active { color: #007bff; }
.active-completed .active-line { background: #007bff; }
.active-cancelled .tab-item.active { color: #ff4d4f; }
.active-cancelled .active-line { background: #ff4d4f; }

.order-list { padding: 20rpx; }
.order-card { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 24rpx; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05); }
.order-header { display: flex; justify-content: space-between; border-bottom: 1rpx solid #f0f0f0; padding-bottom: 20rpx; margin-bottom: 20rpx; align-items: center; }
.hotel-name { font-size: 30rpx; font-weight: bold; color: #333; }
.status-tag { font-size: 22rpx; font-weight: bold; padding: 4rpx 16rpx; border-radius: 8rpx; }
.tag-paid { color: #28a745; background-color: #eafaf1; }
.tag-completed { color: #007bff; background-color: #e7f1ff; }
.tag-cancelled { color: #ff4d4f; background-color: #fff1f0; }
.order-body { margin-bottom: 20rpx; }
.room-info { display: flex; justify-content: space-between; margin-bottom: 20rpx; }
.room-type { font-size: 32rpx; color: #333; font-weight: 500; }
.order-price { font-size: 32rpx; color: #000000; font-weight: bold; }
.guest-details-box { background: #f9f9f9; padding: 20rpx; border-radius: 12rpx; margin-bottom: 16rpx; }
.info-line { display: flex; margin-bottom: 10rpx; font-size: 26rpx; }
.info-label { color: #999; width: 160rpx; }
.info-value { color: #333; font-weight: 500; }
.order-time { font-size: 22rpx; color: #bbb; }
.order-footer { display: flex; justify-content: flex-end; border-top: 1rpx solid #f0f0f0; padding-top: 24rpx; }
.action-btn { font-size: 24rpx; margin-left: 20rpx; padding: 0 30rpx; height: 60rpx; line-height: 60rpx; border-radius: 30rpx; }
.cancel { background: #fff1f0; color: #ff4d4f; border: 1rpx solid #ddd; }
.complete { background: #eafaf1; color: #28a745; }
.review-btn { background: #e7f1ff; color: #007bff; }

.empty-state { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding-bottom: 200rpx; color: #999; font-size: 28rpx; }
.empty-img { width: 200rpx; height: 200rpx; margin-bottom: 20rpx; opacity: 0.5; }

.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 999; display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; width: 85%; padding: 40rpx; border-radius: 30rpx; }
.modal-title { font-size: 34rpx; font-weight: bold; text-align: center; margin-bottom: 30rpx; }
.review-textarea { width: 100%; height: 200rpx; background: #f5f5f5; border-radius: 12rpx; padding: 20rpx; font-size: 28rpx; box-sizing: border-box; }
.modal-btns { display: flex; justify-content: space-between; margin-top: 40rpx; }
.cancel-btn { width: 45%; background: #f5f5f5; color: #666; font-size: 28rpx; border-radius: 40rpx; }
.confirm-btn { width: 45%; background: #28a745; color: #fff; font-size: 28rpx; border-radius: 40rpx; }

/* 夜间模式 */
.dark-mode { background-color: #1a1a1a !important; }
.dark-mode .tabs-bar, .dark-mode .order-card, .dark-mode .modal-content { background-color: #2c2c2c !important; box-shadow: none !important; }
.dark-mode .tab-item { color: #888 !important; }
.dark-mode .hotel-name, .dark-mode .room-type, .dark-mode .order-price, .dark-mode .modal-title { color: #e0e0e0 !important; }
.dark-mode .guest-details-box, .dark-mode .review-textarea { background-color: #333 !important; }
.dark-mode .info-value, .dark-mode .review-textarea { color: #bbb !important; }
.dark-mode .order-header, .dark-mode .order-footer { border-bottom-color: #3d3d3d !important; border-top-color: #3d3d3d !important; }
.dark-mode .cancel-btn { background-color: #3d3d3d !important; color: #999 !important; }
.dark-mode .empty-state { color: #666; }
</style>