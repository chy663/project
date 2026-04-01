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
					<text class="hotel-name">{{ order.hotelName || 'Unknown Hotel' }}</text>
					<view class="status-tag" :class="getStatusClass(order.status)">
						{{ order.status }}
					</view>
				</view>

				<view class="order-body">
					<view class="room-info">
						<text class="room-type">{{ order.roomType || 'Standard Room' }}</text>
						<text class="order-price">${{ order.totalPrice }}</text>
					</view>
					
					<view class="guest-details-box">
						<view class="info-line">
							<text class="info-label">Guest:</text>
							<text class="info-value">{{ order.guestName || 'N/A' }}</text>
						</view>
						<view class="info-line">
							<text class="info-label">Stay:</text>
							<text class="info-value">{{ order.checkInDate }} to {{ order.checkOutDate }}</text>
						</view>
						<view class="info-line">
							<text class="info-label">Phone:</text>
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
						<button class="action-btn ai-btn" @tap="openAIGuideModal(order.id)">AI Guide</button>
						<button class="action-btn review-btn" @tap="openReviewModal(order)">Review</button>
					</template>
				</view>
			</view>
		</view>

		<view v-else class="empty-state">
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

		<view v-if="isAIGuideModalShow" class="modal-mask" @tap="isAIGuideModalShow = false">
			<view class="modal-content ai-modal" @tap.stop>
				<view class="modal-title">AI Travel Guide</view>
				
				<scroll-view scroll-y="true" class="ai-content-scroll" v-if="isAILoading || aiGuideContent">
					<text v-if="isAILoading" class="loading-text">Generating... Please wait.</text>
					<text v-else class="ai-text">{{ aiGuideContent }}</text>
				</scroll-view>
				
				<view v-else class="ai-prompt">
					<text>Ready to explore? Click Generate to create your custom travel guide for your stay.</text>
				</view>

				<view class="modal-btns" v-if="!aiGuideContent">
					<button class="confirm-btn ai-generate-btn" @tap="generateAIGuide" :disabled="isAILoading">Generate</button>
					<button class="cancel-btn" @tap="isAIGuideModalShow = false">Cancel</button>
				</view>
				<view class="modal-btns single-btn" v-else>
					<button class="confirm-btn ai-generate-btn" @tap="isAIGuideModalShow = false">Close</button>
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
			selectedOrder: null,
			
			isAIGuideModalShow: false,
			aiGuideContent: '',
			isAILoading: false,
			currentAIGuideOrderId: null
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
				url: `http://localhost:8089/api/orders/user/${this.userId}`,
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
			return order.createTime ? order.createTime.replace('T', ' ').substring(0, 16) : 'N/A';
		},
		handleCancel(orderId) {
			uni.showModal({
				title: 'Cancel Order', 
				content: 'Are you sure you want to cancel?',
				success: (res) => {
					if (res.confirm) {
						uni.request({
							url: `http://localhost:8089/api/orders/${orderId}/cancel`,
							method: 'POST',
							success: () => { 
								uni.showToast({ title: 'Cancelled' });
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
		},
		openAIGuideModal(orderId) {
			this.currentAIGuideOrderId = orderId;
			this.aiGuideContent = '';
			this.isAILoading = false;
			this.isAIGuideModalShow = true;
		},
		generateAIGuide() {
			if (!this.currentAIGuideOrderId || this.isAILoading) return;
			this.isAILoading = true;
			uni.request({
				url: `http://localhost:8089/api/orders/${this.currentAIGuideOrderId}/ai-guide`,
				method: 'GET',
				success: (res) => {
					this.isAILoading = false;
					if (res.statusCode === 200) {
						this.aiGuideContent = res.data;
					} else {
						this.aiGuideContent = 'Failed to generate guide.';
					}
				},
				fail: () => {
					this.isAILoading = false;
					this.aiGuideContent = 'Network error.';
				}
			});
		}
	}
}
</script>

<style>
/* 保持原有样式并确保新字段布局美观 */
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
.info-label { color: #999; width: 140rpx; }
.info-value { color: #333; font-weight: 500; }
.order-time { font-size: 22rpx; color: #bbb; }

.order-footer { display: flex; justify-content: flex-end; border-top: 1rpx solid #f0f0f0; padding-top: 24rpx; }
.action-btn { font-size: 24rpx; margin-left: 20rpx; padding: 0 30rpx; height: 60rpx; line-height: 60rpx; border-radius: 30rpx; border: none; }
.cancel { background: #fff1f0; color: #ff4d4f; border: 1rpx solid #ddd; }
.complete { background: #eafaf1; color: #28a745; }
.review-btn { background: #e7f1ff; color: #007bff; }
.ai-btn { background: #f3e5f5; color: #9c27b0; }

.empty-state { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding-bottom: 200rpx; color: #999; font-size: 28rpx; }

/* 弹窗样式 */
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 999; display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; width: 85%; padding: 40rpx; border-radius: 30rpx; }
.modal-title { font-size: 34rpx; font-weight: bold; text-align: center; margin-bottom: 30rpx; }
.review-textarea { width: 100%; height: 200rpx; background: #f5f5f5; border-radius: 12rpx; padding: 20rpx; font-size: 28rpx; box-sizing: border-box; }
.modal-btns { display: flex; justify-content: space-between; margin-top: 40rpx; }
.confirm-btn { width: 45%; background: #28a745; color: #fff; font-size: 28rpx; border-radius: 40rpx; }
.cancel-btn { width: 45%; background: #f5f5f5; color: #666; font-size: 28rpx; border-radius: 40rpx; }
.ai-generate-btn { background: #9c27b0 !important; color: #fff !important; flex: 1; margin: 0 10rpx; }
.ai-modal { width: 90%; max-height: 80vh; }
.ai-content-scroll { max-height: 50vh; padding: 20rpx; background: #f9f9f9; border-radius: 12rpx; }
.ai-text { font-size: 28rpx; color: #333; line-height: 1.6; white-space: pre-wrap; }

/* 深色模式样式适配 */
.dark-mode { background-color: #1a1a1a !important; }
.dark-mode .tabs-bar, .dark-mode .order-card, .dark-mode .modal-content { background-color: #2c2c2c !important; box-shadow: none !important; }
.dark-mode .hotel-name, .dark-mode .room-type, .dark-mode .order-price, .dark-mode .modal-title, .dark-mode .ai-text { color: #e0e0e0 !important; }
.dark-mode .guest-details-box, .dark-mode .review-textarea, .dark-mode .ai-content-scroll { background-color: #333 !important; }
.dark-mode .info-value { color: #bbb !important; }
.dark-mode .order-header, .dark-mode .order-footer { border-color: #3d3d3d !important; }
.dark-mode .cancel-btn { background-color: #3d3d3d !important; color: #999 !important; }
.dark-mode .ai-btn { background: #3d2b45 !important; color: #ce93d8 !important; }
</style>