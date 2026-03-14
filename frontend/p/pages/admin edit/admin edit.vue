<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<view class="edit-card">
			<view class="header-section">
				<text class="page-title">Edit Room Details</text>
				<text class="room-name-hint">{{ roomForm.roomType }}</text>
			</view>

			<view class="form-item">
				<text class="label">Price per Night ($)</text>
				<input class="input" type="digit" v-model="roomForm.price" placeholder="Enter price" />
			</view>

			<view class="form-item">
				<text class="label">Max People Capacity</text>
				<input class="input" type="number" v-model="roomForm.maxPeople" placeholder="Enter capacity" />
			</view>

			<view class="btn-group">
				<button class="save-btn" @tap="submitUpdate">Save Changes</button>
				<button class="cancel-btn" @tap="goBack">Cancel</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isDark: false,
			roomId: null,
			hotelId: null,
			roomForm: {
				roomType: '',
				price: '',
				maxPeople: '',
				totalInventory: 0 // 保持原始值
			}
		};
	},
	onLoad(options) {
		this.isDark = uni.getStorageSync('isDarkMode') || false;
		this.roomId = options.id;
		this.hotelId = options.hotelId;
		this.fetchRoomInfo();
	},
	methods: {
		fetchRoomInfo() {
			uni.request({
				url: `http://localhost:8089/api/rooms/${this.roomId}`,
				method: 'GET',
				success: (res) => {
					if (res.statusCode === 200) {
						this.roomForm = res.data;
					}
				}
			});
		},
		submitUpdate() {
			if (!this.roomForm.price || !this.roomForm.maxPeople) {
				uni.showToast({ title: 'Please fill all fields', icon: 'none' });
				return;
			}
			
			uni.request({
				url: `http://localhost:8089/api/rooms/${this.roomId}`,
				method: 'PUT',
				data: {
					price: parseFloat(this.roomForm.price),
					maxPeople: parseInt(this.roomForm.maxPeople),
					roomType: this.roomForm.roomType,
					totalInventory: this.roomForm.totalInventory
				},
				success: (res) => {
					if (res.statusCode === 200) {
						uni.showToast({ title: 'Updated Successfully' });
						// 延迟返回，确保用户看到提示
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.showToast({ title: 'Update Failed', icon: 'none' });
					}
				}
			});
		},
		goBack() {
			uni.navigateBack();
		}
	}
};
</script>

<style scoped>
.container { min-height: 100vh; background-color: #f8f9fb; padding: 40rpx 30rpx; }
.dark-mode { background-color: #1a1a1a; }

.edit-card { background: #ffffff; border-radius: 32rpx; padding: 40rpx; box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.05); }
.dark-mode .edit-card { background: #2c2c2c; }

.header-section { margin-bottom: 50rpx; }
.page-title { font-size: 44rpx; font-weight: bold; color: #1a1a1a; display: block; }
.room-name-hint { font-size: 26rpx; color: #4c6ef5; margin-top: 10rpx; }
.dark-mode .page-title { color: #ffffff; }

.form-item { margin-bottom: 40rpx; }
.label { font-size: 28rpx; color: #666; margin-bottom: 16rpx; display: block; }
.dark-mode .label { color: #aaa; }

.input { 
	background: #f1f3f7; border-radius: 16rpx; height: 100rpx; padding: 0 30rpx; 
	font-size: 32rpx; color: #333; 
}
.dark-mode .input { background: #3d3d3d; color: #fff; }

.btn-group { margin-top: 60rpx; }
.save-btn { background: #4c6ef5; color: #fff; border-radius: 50rpx; height: 100rpx; line-height: 100rpx; font-weight: bold; margin-bottom: 20rpx; }
.cancel-btn { background: transparent; color: #999; border-radius: 50rpx; height: 100rpx; line-height: 100rpx; font-size: 28rpx; }
</style>