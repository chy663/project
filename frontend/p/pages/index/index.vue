<template>
	<view class="container">
		<view class="search-box">
			<icon type="search" size="18" color="#999" />
			<input 
				class="search-input" 
				type="text" 
				placeholder="Search hotel name..." 
				v-model="searchKeyword"
				@input="onSearch"
			/>
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
			<image class="hotel-image" :src="getHotelImage(hotel)" mode="aspectFill"></image>
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
					<input type="number" v-model="personCount" focus />
				</view>
				<button class="confirm-btn" @tap="confirmRoomInfo">Confirm</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			hotelList: [],
			filteredHotelList: [],
			searchKeyword: '',
			// 用于弹出层选择的完整文字
			sortOptions: ['Default', 'Price: Low to High', 'Price: High to Low', 'Star: High to Low', 'Star: Low to High'],
			// 核心修改：用于首页表盘显示的极简字符
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
	onLoad() {
		this.fetchHotelData();
	},
	methods: {
		goToDetail(hotelId) {
			uni.navigateTo({ url: `/pages/detail/detail?id=${hotelId}` });
		},
		getMinPrice(priceStr) {
			if (!priceStr) return 0;
			const match = priceStr.match(/\d+/);
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
		applySort(list) {
			const index = this.sortIndex;
			// 逻辑依然按照索引 0-4 进行匹配
			if (index === 0) list.sort((a, b) => a.id - b.id);
			else if (index === 1) list.sort((a, b) => this.getMinPrice(a.price) - this.getMinPrice(b.price));
			else if (index === 2) list.sort((a, b) => this.getMinPrice(b.price) - this.getMinPrice(a.price));
			else if (index === 3) list.sort((a, b) => b.starRating - a.starRating);
			else if (index === 4) list.sort((a, b) => a.starRating - b.starRating);
			return list;
		},
		showRoomPicker() { this.isRoomPickerShow = true; },
		confirmRoomInfo() {
			this.roomInfoText = `${this.personCount} Guests`;
			this.isRoomPickerShow = false;
			this.applyFilters();
		},
		applyFilters() {
			let list = [...this.hotelList];
			if (this.searchKeyword) {
				const kw = this.searchKeyword.toLowerCase();
				list = list.filter(h => h.name.toLowerCase().includes(kw) || h.address.toLowerCase().includes(kw));
			}
			if (this.selectedLocation && this.selectedLocation !== 'All Regions') {
				list = list.filter(h => h.address.includes(this.selectedLocation));
			}
			if (this.personCount > 0) {
				list = list.filter(h => (h.maxCapacity || 0) >= this.personCount);
			}
			this.filteredHotelList = this.applySort(list);
		},
		fetchHotelData() {
			uni.request({
				url: 'http://localhost:8089/api/hotels',
				method: 'GET',
				success: (res) => {
					this.hotelList = res.data;
					this.applyFilters();
				}
			});
		},
		onSearch() { this.applyFilters(); },
		handleGetLocation() {
			this.locationIndex = 1; 
			this.selectedLocation = 'Street 1';
			this.applyFilters();
			uni.showToast({ title: 'Located: Street 1', icon: 'none' });
		},
		getHotelImage(hotel) {
			if (hotel.name?.includes('Hotel A')) return '/static/1.jpg'; 
			if (hotel.name?.includes('Hotel B')) return '/static/2.jpg';
			if (hotel.name?.includes('Hotel C')) return '/static/3.jpg';
			if (hotel.name?.includes('Hotel D')) return '/static/4.jpg';
			if (hotel.name?.includes('Hotel E')) return '/static/5.jpg';
			return '/static/logo.png';
		}
	}
}
</script>

<style>
.container { padding: 20rpx; background-color: #f8f8f8; min-height: 100vh; }
.search-box { display: flex; align-items: center; background-color: #fff; padding: 15rpx 25rpx; border-radius: 40rpx; margin-bottom: 20rpx; box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05); }
.search-input { flex: 1; margin-left: 15rpx; font-size: 28rpx; }

/* 筛选工具栏样式 */
.filter-bar { display: flex; justify-content: space-between; background-color: #fff; padding: 25rpx 10rpx; border-radius: 12rpx; margin-bottom: 30rpx; align-items: center; }
.filter-item { flex: 1; text-align: center; border-right: 1rpx solid #eee; height: 60rpx; display: flex; align-items: center; justify-content: center; }
.filter-item:last-child { border-right: none; }

/* 表盘文字加粗 */
.picker-text { 
	font-size: 28rpx; 
	color: #000; 
	font-weight: bold; 
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1; 
	overflow: hidden;
}

/* 核心高亮：强制加粗黑亮 */
.active-text { 
	font-weight: 1000 !important; 
	color: #000 !important; 
}

.arrow { font-size: 20rpx; margin-left: 6rpx; color: #000; font-weight: bold; }
.active-arrow { color: #000 !important; }

/* 位置按钮 */
.location-wrapper { display: flex; align-items: center; justify-content: center; }
.picker-main { flex: 1; width: 100%; overflow: hidden; }
.location-btn { padding: 0 10rpx; flex-shrink: 0; }
.location-icon { color: #42b983; font-size: 34rpx; font-weight: bold; }

/* 酒店卡片样式参考 */
.hotel-card { display: flex; background-color: #fff; border-radius: 16rpx; margin-bottom: 20rpx; padding: 20rpx; box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.03); }
.hotel-image { width: 180rpx; height: 180rpx; border-radius: 12rpx; flex-shrink: 0; }
.hotel-info { flex: 1; margin-left: 24rpx; display: flex; flex-direction: column; justify-content: space-between; }
.hotel-name { font-size: 30rpx; font-weight: bold; color: #333; }
.capacity-tag { font-size: 20rpx; color: #42b983; background: #eaf8f1; padding: 2rpx 12rpx; border-radius: 6rpx; }
.hotel-address { font-size: 24rpx; color: #888; }
.price-row { display: flex; justify-content: space-between; align-items: flex-end; }
.hotel-price { color: #ff4d4f; font-size: 36rpx; font-weight: bold; }
.hotel-rating { font-size: 22rpx; color: #faad14; background: #fffbe6; padding: 2rpx 10rpx; border-radius: 4rpx; border: 1rpx solid #ffe58f; }

/* 弹窗 */
.modal-mask { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 999; display: flex; align-items: center; justify-content: center; }
.modal-content { background: #fff; width: 80%; padding: 40rpx; border-radius: 24rpx; }
.confirm-btn { background: #42b983; color: #fff; border-radius: 40rpx; margin-top: 20rpx; font-size: 30rpx; }
</style>