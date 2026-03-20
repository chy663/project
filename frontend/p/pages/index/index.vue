<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<view class="search-box">
			<icon type="search" size="18" color="#999" />
			<input 
				class="search-input" 
				type="text" 
				placeholder="Enter your requirements..." 
				v-model="searchKeyword"
				confirm-type="search"
				@confirm="handleAiSearch"
			/>
			<view class="search-confirm-btn" @tap="handleAiSearch">AI Search</view>
		</view>

		<view class="filter-bar">
			<picker @change="onSortChange" :value="sortIndex" :range="sortOptions" class="filter-item">
				<view class="picker-text active-text">
					{{ sortDisplayOptions[sortIndex] }}
					<text class="arrow active-arrow">▼</text>
				</view>
			</picker>

			<view class="filter-item location-wrapper">
				<picker @change="onLocationChange" :value="locationIndex" :range="locationOptions" class="picker-main">
					<view class="picker-text active-text">
						{{ locationOptions[locationIndex] }}
						<text class="arrow active-arrow">▼</text>
					</view>
				</picker>
				<view class="location-btn" @tap="handleGetLocation">
					<text class="location-icon">⊕</text>
				</view>
			</view>

			<view class="filter-item" @tap="showRoomPicker">
				<view class="picker-text active-text">
					{{ roomInfoText || 'Guests' }}
					<text class="arrow active-arrow">▼</text>
				</view>
			</view>
		</view>

		<view 
			v-for="hotel in filteredHotelList" 
			:key="hotel.id" 
			class="hotel-card"
			@tap="goToDetail(hotel.id)"
		>
			<swiper 
				class="hotel-image" 
				circular 
				indicator-dots 
				indicator-color="rgba(255,255,255,0.6)"
				indicator-active-color="#ffffff"
				autoplay
				interval="3000"
				duration="500"
				@tap.stop
			>
				<swiper-item v-for="(img, index) in getHotelImages(hotel)" :key="index">
					<image class="swiper-item-img" :src="img" mode="aspectFill"></image>
				</swiper-item>
			</swiper>

			<view class="hotel-info">
				<view class="name-address-box">
					<view class="title-row">
						<text class="hotel-name">{{ hotel.name }}</text>
						<text class="capacity-tag" v-if="hotel.capacity">{{ hotel.capacity }} Persons</text>
					</view>
					<text class="hotel-address">{{ hotel.address }}</text>
				</view>
				<view class="price-row">
					<view class="price-col">
						<text class="hotel-price">${{ hotel.price }}</text>
					</view>
					<text class="hotel-rating">{{ hotel.starRating }} Stars</text>
				</view>
			</view>
		</view>

		<view v-if="isRoomPickerShow" class="modal-mask" @tap="isRoomPickerShow = false">
			<view class="modal-content" @tap.stop>
				<view class="modal-title">Booking Details</view>
				<view class="input-row">
					<text>Guests</text>
					<input type="number" v-model="personCount" focus style="border-bottom: 1px solid #eee; margin: 20rpx 0;"/>
				</view>
				<button class="confirm-btn" @tap="confirmRoomInfo">Confirm</button>
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
			hotelList: [],
			filteredHotelList: [],
			searchKeyword: '',
			sortOptions: ['Default', 'Price: Low to High', 'Price: High to Low', 'Star: High to Low', 'Star: Low to High'],
			sortDisplayOptions: ['Default', 'Price ↑', 'Price ↓', 'Star ↓', 'Star ↑'],
			locationOptions: ['All Regions', 'Street 1', 'Street 2', 'Street 3', 'Street 4', 'Street 5'],
			sortIndex: 0, 
			locationIndex: 0,
			selectedLocation: '',
			isRoomPickerShow: false,
			personCount: 1,
			roomInfoText: ''
		}
	},
	onShow() {
		this.checkLoginState();
	},
	methods: {
		checkLoginState() {
			const userInfo = uni.getStorageSync('userInfo');
			if (!userInfo || !userInfo.username) {
				uni.reLaunch({ url: '/pages/login/login' });
			} else {
				if (this.hotelList.length === 0) {
					this.fetchHotelData();
				}
			}
		},
		// 1. 获取初始数据：改用 AI 搜索接口并传空，确保后端返回全部
		fetchHotelData() {
			uni.request({
				url: 'http://localhost:8089/api/hotels/ai-search',
				method: 'GET',
				data: { query: '' }, 
				success: (res) => {
					if (res.statusCode === 200 && Array.isArray(res.data)) {
						this.hotelList = res.data;
						this.applyFilters();
					} else {
						console.error("Fetch Data Failed:", res.data);
						this.hotelList = [];
						this.applyFilters();
					}
				}
			});
		},
		// 2. AI 搜索：搜索结果存入 hotelList 并触发统一过滤
		handleAiSearch() {
			const query = this.searchKeyword.trim();
			if (!query) {
				this.fetchHotelData();
				return;
			}
			uni.showLoading({ title: 'AI Searching...' });
			uni.request({
				url: 'http://localhost:8089/api/hotels/ai-search',
				method: 'GET',
				data: { query: query },
				success: (res) => {
					if (res.statusCode === 200 && Array.isArray(res.data)) {
						this.hotelList = res.data;
						this.applyFilters();
						if (this.hotelList.length === 0) {
							uni.showToast({ title: 'Not Found', icon: 'none' });
						}
					}
				},
				fail: (err) => {
					console.error("搜索失败:", err);
					uni.showToast({ title: '网络异常', icon: 'none' });
				},
				complete: () => {
					uni.hideLoading();
				}
			});
		},
		// 3. 核心过滤器：增加了对 hotelList 的类型保护
		applyFilters() {
			// 修复报错的关键：确保 list 永远是一个数组，即便 hotelList 是 null
			let list = Array.isArray(this.hotelList) ? [...this.hotelList] : [];
			
			if (this.selectedLocation && this.selectedLocation !== 'All Regions') {
				list = list.filter(h => h.address && h.address.includes(this.selectedLocation));
			}
			if (this.personCount > 0) {
				list = list.filter(h => (h.maxCapacity || 0) >= this.personCount);
			}
			this.filteredHotelList = this.applySort(list);
		},
		applySort(list) {
			const index = this.sortIndex;
			// 复制一份进行排序
			let sortedList = [...list];
			if (index === 0) sortedList.sort((a, b) => a.id - b.id);
			else if (index === 1) sortedList.sort((a, b) => this.getMinPrice(a.price) - this.getMinPrice(b.price));
			else if (index === 2) sortedList.sort((a, b) => this.getMinPrice(b.price) - this.getMinPrice(a.price));
			else if (index === 3) sortedList.sort((a, b) => b.starRating - a.starRating);
			else if (index === 4) sortedList.sort((a, b) => a.starRating - b.starRating);
			return sortedList;
		},
		getMinPrice(priceStr) {
			if (typeof priceStr === 'number') return priceStr;
			if (!priceStr) return 0;
			const match = String(priceStr).match(/\d+/);
			return match ? parseFloat(match[0]) : 0;
		},
		onSortChange(e) {
			this.sortIndex = parseInt(e.detail.value);
			this.applyFilters();
		},
		onLocationChange(e) {
			this.locationIndex = parseInt(e.detail.value);
			this.selectedLocation = this.locationIndex > 0 ? this.locationOptions[this.locationIndex] : '';
			this.applyFilters();
		},
		showRoomPicker() { this.isRoomPickerShow = true; },
		confirmRoomInfo() {
			this.roomInfoText = `${this.personCount} Guests`;
			this.isRoomPickerShow = false;
			this.applyFilters();
		},
		handleGetLocation() {
			this.locationIndex = 1; 
			this.selectedLocation = 'Street 1';
			this.applyFilters();
			uni.showToast({ title: 'Located: Street 1', icon: 'none' });
		},
		goToDetail(hotelId) {
			uni.navigateTo({ url: `/pages/detail/detail?id=${hotelId}` });
		},
		getHotelImages(hotel) {
			const name = hotel.name || '';
			if (name.includes('Hotel A')) return ['/static/1.jpg', '/static/1-1.jpg', '/static/1-2.jpg'];
			if (name.includes('Hotel B')) return ['/static/2.jpg', '/static/2-1.jpg', '/static/2-2.jpg'];
			if (name.includes('Hotel C')) return ['/static/3.jpg', '/static/3-1.jpg', '/static/3-2.jpg'];
			if (name.includes('Hotel D')) return ['/static/4.jpg', '/static/4-1.jpg', '/static/4-2.jpg'];
			if (name.includes('Hotel E')) return ['/static/5.jpg', '/static/5-1.jpg', '/static/5-2.jpg'];
			return ['/static/logo.png'];
		}
	}
}
</script>

<style>
/* 样式部分完全保留，不做任何修改 */
.container { padding: 20rpx; background-color: #f8f8f8; min-height: 100vh; }
.search-box { display: flex; align-items: center; background-color: #fff; padding: 10rpx 25rpx; border-radius: 40rpx; margin-bottom: 20rpx; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05); }
.search-input { flex: 1; margin-left: 15rpx; font-size: 28rpx; height: 70rpx; }
.search-confirm-btn { background-color: #42b983; color: #fff; font-size: 24rpx; padding: 10rpx 25rpx; border-radius: 30rpx; margin-left: 10rpx; font-weight: bold; }
.filter-bar { display: flex; justify-content: space-between; background-color: #fff; padding: 25rpx 10rpx; border-radius: 12rpx; margin-bottom: 30rpx; align-items: center; }
.filter-item { flex: 1; text-align: center; border-right: 1rpx solid #eee; height: 60rpx; display: flex; align-items: center; justify-content: center; }
.filter-item:last-child { border-right: none; }
.picker-text { font-size: 28rpx; color: #000; font-weight: bold; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; overflow: hidden; }
.active-text { font-weight: 1000 !important; color: #000 !important; }
.arrow { font-size: 20rpx; margin-left: 6rpx; color: #000; font-weight: bold; }
.active-arrow { color: #000 !important; }
.location-wrapper { display: flex; align-items: center; justify-content: center; }
.picker-main { flex: 1; width: 100%; overflow: hidden; }
.location-btn { padding: 0 10rpx; flex-shrink: 0; }
.location-icon { color: #42b983; font-size: 34rpx; font-weight: bold; }
.hotel-card { display: flex; background-color: #fff; border-radius: 16rpx; margin-bottom: 20rpx; padding: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03); }
.hotel-image { width: 180rpx; height: 180rpx; border-radius: 12rpx; flex-shrink: 0; overflow: hidden; }
.swiper-item-img { width: 100%; height: 100%; }
.hotel-info { flex: 1; margin-left: 24rpx; display: flex; flex-direction: column; justify-content: space-between; }
.title-row { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.hotel-name { font-size: 30rpx; font-weight: bold; color: #333; flex: 1; margin-right: 10rpx; }
.capacity-tag { font-size: 20rpx; color: #42b983; background: #eaf8f1; padding: 2rpx 12rpx; border-radius: 6rpx; white-space: nowrap; margin-left: 10rpx; }
.hotel-address { font-size: 24rpx; color: #888; }
.price-row { display: flex; justify-content: space-between; align-items: flex-end; }
.hotel-price { color: #000000; font-size: 36rpx; font-weight: bold; }
.hotel-rating { font-size: 22rpx; color: #faad14; background: #fffbe6; padding: 2rpx 10rpx; border-radius: 4rpx; border: 1rpx solid #ffe58f; }
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 999; display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; width: 80%; padding: 40rpx; border-radius: 24rpx; }
.confirm-btn { background: #42b983; color: #fff; border-radius: 40rpx; margin-top: 20rpx; font-size: 30rpx; }
.dark-mode { background-color: #1a1a1a !important; }
.dark-mode .search-box, .dark-mode .filter-bar, .dark-mode .hotel-card, .dark-mode .modal-content { background-color: #2c2c2c !important; }
.dark-mode .search-input, .dark-mode .picker-text, .dark-mode .hotel-name, .dark-mode .modal-title { color: #e0e0e0 !important; }
.dark-mode .active-text, .dark-mode .arrow, .dark-mode .active-arrow { color: #ffffff !important; }
.dark-mode .hotel-price { color: #ffffff !important; }
</style>