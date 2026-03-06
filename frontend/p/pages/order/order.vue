<template>
	<view class="container">
		<view class="header">My Orders</view>

		<view class="tabs">
			<view class="tab-item" :class="{ active: currentTab === 'PAID' }" @click="switchTab('PAID')">Paid</view>
			<view class="tab-item" :class="{ active: currentTab === 'COMPLETED' }" @click="switchTab('COMPLETED')">Completed</view>
		</view>

		<view v-if="filteredOrders.length > 0" class="order-list">
			<view v-for="order in filteredOrders" :key="order.id" class="order-card">
				<view class="order-header-row">
					<text class="order-id">Order ID: #{{ order.id }}</text>
					<text class="status-badge" :class="order.status.toLowerCase()">{{ order.status }}</text>
				</view>
				
				<view class="order-info">
					<view class="info-row">
						<text class="label">Hotel:</text>
						<text class="value">{{ order.hotelName || 'N/A' }}</text>
					</view>
					<view class="info-row">
						<text class="label">Room Type:</text>
						<text class="value">{{ order.roomType || 'N/A' }}</text>
					</view>
					
					<view class="info-row time-row">
						<text class="label">{{ order.status === 'PAID' ? 'Paid Time:' : 'Completed Time:' }}</text>
						<text class="value time-value">
							{{ order.status === 'PAID' ? formatDate(order.createTime) : formatDate(order.completeTime) }}
						</text>
					</view>

					<view class="info-row">
						<text class="label">Total Price:</text>
						<text class="value price">${{ order.totalPrice }}</text>
					</view>
				</view>

				<view v-if="order.status === 'PAID'" class="action-bar">
					<button class="complete-btn" @click="handleComplete(order.id)">Complete</button>
					<button class="cancel-btn" @click="handleCancel(order.id)">Cancel</button>
				</view>
			</view>
		</view>

		<view v-else class="empty-state">
			<text>No {{ currentTab.toLowerCase() }} orders found.</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			currentTab: 'PAID',
			allOrders: []
		}
	},
	computed: {
		filteredOrders() {
			return this.allOrders.filter(order => order.status === this.currentTab);
		}
	},
	onShow() {
		this.fetchOrders();
	},
	methods: {
		switchTab(tab) {
			this.currentTab = tab;
		},
		fetchOrders() {
			uni.request({
				url: 'http://localhost:8089/api/orders/user/1',
				method: 'GET',
				success: (res) => {
					this.allOrders = res.data;
				}
			});
		},
		// 新增：时间格式化函数，将后端返回的 ISO 字符串转为 YYYY-MM-DD HH:mm 格式
		formatDate(dateString) {
			if (!dateString) return 'N/A';
			const date = new Date(dateString);
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			return `${year}-${month}-${day} ${hours}:${minutes}`;
		},
		handleComplete(orderId) {
			uni.showModal({
				title: 'Complete Order',
				content: 'Mark this order as completed?',
				confirmText: 'Yes',
				cancelText: 'No',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: 'Processing...' });
						uni.request({
							url: `http://localhost:8089/api/orders/${orderId}/complete`,
							method: 'POST',
							success: (completeRes) => {
								uni.hideLoading();
								if (completeRes.statusCode === 200) {
									uni.showToast({ title: 'Completed', icon: 'success' });
									this.fetchOrders();
								} else {
									uni.showToast({ title: 'Error', icon: 'none' });
								}
							}
						});
					}
				}
			});
		},
		handleCancel(orderId) {
			uni.showModal({
				title: 'Cancel Booking',
				content: 'Are you sure you want to cancel this booking?',
				confirmText: 'Yes',
				cancelText: 'No',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({ title: 'Cancelling...' });
						uni.request({
							url: `http://localhost:8089/api/orders/${orderId}/cancel`,
							method: 'POST',
							success: (cancelRes) => {
								uni.hideLoading();
								if (cancelRes.statusCode === 200) {
									uni.showToast({ title: 'Cancelled', icon: 'success' });
									this.fetchOrders();
								} else {
									uni.showToast({ title: 'Error', icon: 'none' });
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
.container { padding: 30rpx; background-color: #f8f8f8; min-height: 100vh; }
.header { font-size: 40rpx; font-weight: bold; margin-bottom: 30rpx; color: #333; }

.tabs { display: flex; background: #fff; border-radius: 15rpx; margin-bottom: 30rpx; padding: 10rpx; }
.tab-item { flex: 1; text-align: center; padding: 20rpx 0; font-size: 28rpx; color: #666; transition: all 0.3s; }
.tab-item.active { color: #007aff; font-weight: bold; border-bottom: 4rpx solid #007aff; }

.order-card { background: #fff; border-radius: 20rpx; padding: 30rpx; margin-bottom: 30rpx; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05); }
.order-header-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1rpx solid #f0f0f0; padding-bottom: 15rpx; margin-bottom: 15rpx; }
.order-id { font-size: 24rpx; color: #999; }
.status-badge { font-size: 22rpx; padding: 4rpx 12rpx; border-radius: 6rpx; text-transform: uppercase; }
.status-badge.paid { background: #e8f5e9; color: #2e7d32; }
.status-badge.completed { background: #f5f5f5; color: #616161; }

.info-row { display: flex; justify-content: space-between; margin-bottom: 15rpx; }
.label { color: #666; font-size: 28rpx; }
.value { color: #333; font-size: 28rpx; font-weight: 500; text-align: right; flex: 1; margin-left: 20rpx; }

/* 针对时间的样式微调，使其更像附加信息 */
.time-value { color: #888; font-size: 26rpx; font-weight: normal; }
.price { color: #000000; font-weight: bold; }

.action-bar { margin-top: 20rpx; display: flex; justify-content: flex-end; align-items: center; }

.complete-btn { 
	margin: 0; font-size: 24rpx; color: #28a745; border: 1rpx solid #28a745; 
	background: transparent; height: 60rpx; line-height: 60rpx; border-radius: 30rpx; padding: 0 30rpx;
}

.cancel-btn { 
	margin: 0 0 0 20rpx; font-size: 24rpx; color: #ff5a5f; border: 1rpx solid #ff5a5f; 
	background: transparent; height: 60rpx; line-height: 60rpx; border-radius: 30rpx; padding: 0 30rpx;
}

.empty-state { text-align: center; margin-top: 200rpx; color: #bbb; font-size: 30rpx; }
</style>