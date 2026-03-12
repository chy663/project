<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<view class="page-header">
			<text class="page-title">My Favorites</text>
		</view>

		<view v-if="favoriteRooms.length > 0" class="room-list">
			<view v-for="(room, index) in favoriteRooms" :key="index" class="room-item" @click="goToRoomDetail(room)">
				<image class="room-thumbnail" :src="getRoomImage(room)" mode="aspectFill"></image>
				
				<view class="room-details">
					<text class="room-type">{{ room.roomType }}</text>
					<text class="room-price">${{ room.price }} / Night</text>
				</view>
				
				<view class="action-col" @click.stop="cancelFavorite(room, index)">
					<image class="fav-icon" src="/static/已收藏.png"></image>
				</view>
			</view>
		</view>

		<view v-else class="empty-state">
			<image src="/static/logo.png" mode="aspectFit" class="empty-img"></image>
			<text>You haven't favorited any rooms yet.</text>
		</view>
	</view>
</template>

<script>
import { themeMixin } from '@/mixins/theme.js';
export default {
	mixins: [themeMixin],
	data() {
		return {
			favoriteRooms: [],
			currentUserId: 1
		}
	},
	onShow() {
		const userInfo = uni.getStorageSync('userInfo');
		if (userInfo && userInfo.id) {
			this.currentUserId = userInfo.id;
		}
		this.fetchFavoriteRooms();
	},
	methods: {
		fetchFavoriteRooms() {
			uni.request({
				url: `http://localhost:8089/api/favorites/user/${this.currentUserId}/rooms`,
				method: 'GET',
				success: (res) => {
					if (res.statusCode === 200) {
						this.favoriteRooms = Array.isArray(res.data) ? res.data : [];
					} else {
						this.favoriteRooms = [];
					}
				},
				fail: () => {
					this.favoriteRooms = [];
				}
			});
		},
		cancelFavorite(room, index) {
			const removedRoom = this.favoriteRooms.splice(index, 1)[0];
			
			uni.request({
				url: 'http://localhost:8089/api/favorites/toggle',
				method: 'POST',
				data: { userId: this.currentUserId, roomId: room.id },
				success: (res) => {
					if (res.statusCode === 200) {
						uni.showToast({ title: 'Removed', icon: 'none' });
						this.fetchFavoriteRooms(); 
					} else {
						this.favoriteRooms.splice(index, 0, removedRoom);
						uni.showToast({ title: 'Failed to remove', icon: 'none' });
					}
				},
				fail: () => {
					this.favoriteRooms.splice(index, 0, removedRoom);
					uni.showToast({ title: 'Network Error', icon: 'none' });
				}
			});
		},
		goToRoomDetail(room) {
			uni.navigateTo({
				url: `/pages/roomDetail/roomDetail?id=${room.id}&hotelId=${room.hotelId}`
			});
		},
		getRoomImage(room) {
			if (!room || !room.roomType) {
				return '/static/logo.png'; 
			}
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

<style>
.container { padding: 20rpx; background-color: #f8f8f8; min-height: 100vh; }
.page-header { padding: 10rpx 10rpx 30rpx; }
.page-title { font-size: 44rpx; font-weight: bold; color: #333; }
.room-list { background: #fff; border-radius: 15rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05); }
.room-item { display: flex; flex-direction: row; align-items: center; padding: 30rpx; border-bottom: 1rpx solid #f0f0f0; }
.room-thumbnail { width: 160rpx; height: 160rpx; border-radius: 12rpx; margin-right: 25rpx; flex-shrink: 0; background-color: #f5f5f5; }
.room-details { flex: 1; display: flex; flex-direction: column; justify-content: center; }
.room-type { font-size: 30rpx; font-weight: bold; color: #333; margin-bottom: 12rpx; }
.room-price { font-size: 32rpx; color: #000000; font-weight: bold; }
.action-col { padding: 20rpx 0 20rpx 20rpx; display: flex; align-items: center; justify-content: flex-end; }
.fav-icon { width: 50rpx; height: 50rpx; transition: transform 0.2s; }
.fav-icon:active { transform: scale(1.3); }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding-top: 200rpx; color: #999; }
.empty-img { width: 200rpx; height: 200rpx; margin-bottom: 20rpx; opacity: 0.5; }

/* 夜间模式适配 */
.dark-mode { background-color: #1a1a1a !important; }
.dark-mode .page-title, .dark-mode .room-type, .dark-mode .room-price { color: #e0e0e0 !important; }
.dark-mode .room-list { background-color: #2c2c2c !important; }
.dark-mode .room-item { border-bottom-color: #3d3d3d !important; }
</style>