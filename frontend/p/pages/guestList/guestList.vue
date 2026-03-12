<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<view class="header" v-if="isSelectMode">
			<text class="hint-text">Tap a guest to select for your booking</text>
		</view>

		<view v-if="guestList.length > 0" class="list-section">
			<view class="section-title">Existed Guests Info</view>
			
			<view class="guest-list">
				<view v-for="(guest, index) in guestList" :key="index" class="guest-card">
					<view class="guest-info" @tap="handleSelectGuest(guest)">
						<text class="guest-name">{{ guest.name }}</text>
						<text class="guest-phone">{{ guest.phone }}</text>
					</view>
					<view class="action-box" @tap="deleteGuest(index)">
						<text class="delete-icon">🗑Delete️</text>
					</view>
				</view>
			</view>
		</view> <view v-else class="empty-state">
			<text>No saved guests yet.</text>
		</view>

		<view class="add-section">
			<view class="section-title">Add New Guest</view>
			<view class="input-row">
				<input class="uni-input" v-model="newName" placeholder="Full Name" />
			</view>
			<view class="input-row">
				<input class="uni-input" type="number" v-model="newPhone" placeholder="Phone Number" />
			</view>
			<button class="add-btn" @tap="addGuest">Save Guest</button>
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
			guestList: [],
			newName: '',
			newPhone: '',
			isSelectMode: false,
			currentUserId: 1
		}
	},
	onLoad(options) {
		if (options.mode === 'select') {
			this.isSelectMode = true;
		}
		
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo && userInfo.id) {
			this.currentUserId = userInfo.id;
		}
		this.loadGuests();
	},
	methods: {
		loadGuests() {
			const saved = uni.getStorageSync(`guestList_${this.currentUserId}`);
			if (saved) {
				this.guestList = saved;
			}
		},
		addGuest() {
			if (!this.newName.trim() || !this.newPhone.trim()) {
				uni.showToast({ title: 'Please fill all fields', icon: 'none' });
				return;
			}
			this.guestList.push({
				name: this.newName.trim(),
				phone: this.newPhone.trim()
			});
			uni.setStorageSync(`guestList_${this.currentUserId}`, this.guestList);
			this.newName = '';
			this.newPhone = '';
			uni.showToast({ title: 'Saved successfully', icon: 'success' });
		},
		deleteGuest(index) {
			uni.showModal({
				title: 'Delete Guest',
				content: 'Are you sure?',
				success: (res) => {
					if (res.confirm) {
						this.guestList.splice(index, 1);
						uni.setStorageSync(`guestList_${this.currentUserId}`, this.guestList);
					}
				}
			});
		},
		handleSelectGuest(guest) {
			if (this.isSelectMode) {
				uni.$emit('onGuestSelect', guest);
				uni.navigateBack();
			}
		}
	}
}
</script>

<style>
/* 以下所有原有样式代码完全保持不变 */
.container { padding: 20rpx; background-color: #f5f5f5; min-height: 100vh; }
.header { background: #eafaf1; padding: 20rpx; border-radius: 12rpx; margin-bottom: 20rpx; text-align: center; }
.hint-text { color: #28a745; font-size: 26rpx; font-weight: bold; }

.list-section { background: #fff; padding: 30rpx; border-radius: 16rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); margin-bottom: 40rpx; }
.guest-list { margin-top: 20rpx; }
.guest-card { background: #f9f9f9; border-radius: 16rpx; padding: 30rpx; margin-bottom: 20rpx; display: flex; justify-content: space-between; align-items: center; border: 1rpx solid #eee; }
.guest-info { flex: 1; }
.guest-name { font-size: 32rpx; font-weight: bold; color: #333; display: block; margin-bottom: 10rpx; }
.guest-phone { font-size: 26rpx; color: #666; }
.action-box { padding: 10rpx 20rpx; }
.delete-icon { 
    font-size: 36rpx; 
    color: #ff4d4f; /* 设置为红色 */
    opacity: 1;    /* 设置为不透明，让红色更明显 */
}
.empty-state { text-align: center; color: #999; padding: 60rpx 0; font-size: 28rpx; }
.add-section { background: #fff; padding: 30rpx; border-radius: 16rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.section-title { font-size: 32rpx; font-weight: bold; margin-bottom: 30rpx; border-left: 8rpx solid #28a745; padding-left: 20rpx; color: #333;}
.input-row { margin-bottom: 20rpx; border-bottom: 1rpx solid #eee; padding-bottom: 10rpx; }
.uni-input { height: 80rpx; font-size: 28rpx; }
.add-btn { background: #28a745; color: #fff; border-radius: 40rpx; margin-top: 30rpx; font-size: 30rpx; font-weight: bold; }

/* 仅在下方新增夜间模式适配代码，不影响上方原有排版 */
.dark-mode { background-color: #1a1a1a !important; }
.dark-mode .list-section, 
.dark-mode .add-section { background-color: #2c2c2c !important; box-shadow: none !important; }
.dark-mode .guest-card { background-color: #333 !important; border-color: #444 !important; }
.dark-mode .guest-name, 
.dark-mode .section-title { color: #e0e0e0 !important; }
.dark-mode .guest-phone { color: #888 !important; }
.dark-mode .uni-input { color: #ffffff !important; }
.dark-mode .input-row { border-bottom-color: #3d3d3d !important; }
.dark-mode .header { background-color: #1e2a23 !important; } /* 深绿色背景适配 */
</style>