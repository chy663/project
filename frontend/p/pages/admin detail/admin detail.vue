<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<view class="hotel-header">
			<image class="hotel-image" :src="hotelImage" mode="aspectFill"></image>
			<view class="hotel-info">
				<text class="hotel-name">{{ hotelName }} (Management)</text>
			</view>
		</view>

		<view class="section-title">Room Management</view>

		<view class="room-list">
			<view v-for="(room, index) in roomList" :key="index" class="room-item">
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
				
				<view class="action-col">
					<button 
						class="edit-button" 
						@click="goToEditRoom(room)"
					>
						Edit
					</button>
				</view>
			</view>
		</view>

		<view class="tabbar-placeholder"></view>
	</view>
</template>

<script>
import { themeMixin } from '@/mixins/theme.js';
export default {
	mixins: [themeMixin],
	data() {
		return {
			hotelId: null,
			hotelName: 'Loading...',
			hotelImage: '/static/1.jpg',
			roomList: [],
			currentUserId: null
		}
	},
	onLoad(options) {
		this.hotelId = options.id;
		this.hotelImage = `/static/${options.id}.jpg`;
		
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo) {
			this.currentUserId = userInfo.id;
		}
		
		this.fetchHotelInfo();
		this.fetchRoomData();
	},
	methods: {
		fetchHotelInfo() {
			uni.request({
				url: `http://localhost:8089/api/hotels/${this.hotelId}`,
				method: 'GET',
				success: (res) => {
					this.hotelName = res.data.name;
				}
			});
		},
		fetchRoomData() {
			uni.request({
				url: `http://localhost:8089/api/rooms/hotel/${this.hotelId}`,
				method: 'GET',
				success: (res) => {
					this.roomList = res.data;
				}
			});
		},
		goToEditRoom(room) {
			uni.navigateTo({
				url: `/pages/admin edit/admin edit?id=${room.id}&hotelId=${this.hotelId}`
			});
		},
		getRoomImage(room) {
			if (!room || !room.roomType) return '/static/logo.png';
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
		}
	}
}
</script>

<style scoped>
.container { padding: 20rpx; background-color: #f5f5f5; min-height: 100vh; }
.hotel-header { background: #fff; border-radius: 15rpx; overflow: hidden; margin-bottom: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.hotel-image { width: 100%; height: 350rpx; }
.hotel-info { padding: 20rpx; }
.hotel-name { font-size: 36rpx; font-weight: bold; color: #333; }

.section-title { font-size: 32rpx; font-weight: bold; margin: 30rpx 10rpx 20rpx; color: #4c6ef5; }

.room-list { background: #fff; border-radius: 15rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.room-item { display: flex; flex-direction: row; justify-content: space-between; align-items: center; padding: 30rpx; border-bottom: 1rpx solid #f0f0f0; }

.room-thumbnail { width: 160rpx; height: 160rpx; border-radius: 12rpx; margin-right: 20rpx; flex-shrink: 0; }
.room-details { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
.room-title-row { display: flex; flex-direction: row; align-items: center; margin-bottom: 12rpx; width: 100%; }
.name-container { flex: 0 0 180rpx; margin-right: 15rpx; }
.room-type { font-size: 28rpx; font-weight: bold; color: #333; }
.room-inventory { font-size: 20rpx; padding: 4rpx 10rpx; border-radius: 6rpx; white-space: nowrap; }
.stock-green { color: #28a745; background: #eafaf1; }
.stock-red { color: #ff4d4f; background: #fff1f0; }
.room-price { font-size: 28rpx; color: #000; font-weight: bold; margin-bottom: 8rpx; }
.room-max { font-size: 22rpx; color: #999; }

/* Edit Button Style: Blue for Admin Actions */
.edit-button { 
	background-color: #4c6ef5; 
	color: white; 
	font-size: 24rpx; 
	width: 120rpx; 
	height: 60rpx; 
	line-height: 60rpx; 
	border-radius: 30rpx; 
	display: flex; 
	justify-content: center; 
	align-items: center; 
}

.tabbar-placeholder { height: 120rpx; }

/* Dark Mode Support */
.dark-mode { background-color: #1a1a1a !important; }
.dark-mode .hotel-header, .dark-mode .room-list { background-color: #2c2c2c !important; }
.dark-mode .hotel-name, .dark-mode .room-type, .dark-mode .room-price { color: #e0e0e0 !important; }
.dark-mode .room-item { border-bottom-color: #3d3d3d !important; }
.dark-mode .room-max { color: #888 !important; }
</style>