<template>
	<view :class="['container', isDark ? 'dark-mode' : '']">
		<view class="header-bg">
			<view class="title-container">
				<text class="page-title">System Settings</text>
			</view>
		</view>

		<view class="content-wrapper">
			<view class="menu-card">
				<picker @change="onThemeChange" :value="themeIndex" :range="themeOptions">
					<view class="menu-item">
						<view class="item-left">
							<text class="menu-icon">🎨</text>
							<text class="menu-text">Personalized Theme</text>
						</view>
						<view class="item-right">
							<text class="status-text">{{ themeOptions[themeIndex] }}</text>
							<text class="arrow">❯</text>
						</view>
					</view>
				</picker>

				<view class="menu-item" @tap="checkUpdate">
					<view class="item-left">
						<text class="menu-icon">🚀</text>
						<text class="menu-text">Check for Updates</text>
					</view>
					<view class="item-right">
						<text class="status-text">v{{ currentVersion }}</text>
						<text class="arrow">❯</text>
					</view>
				</view>
				
				<view class="menu-item" @tap="handlePolicyClick('Privacy Policy')">
					<view class="item-left">
						<text class="menu-icon">🛡️</text>
						<text class="menu-text">Privacy Policy</text>
					</view>
					<text class="arrow">❯</text>
				</view>
				
				<view class="menu-item" @tap="handlePolicyClick('User Agreement')">
					<view class="item-left">
						<text class="menu-icon">📄</text>
						<text class="menu-text">User Agreement</text>
					</view>
					<text class="arrow">❯</text>
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
			currentVersion: '1.0.2',
			themeOptions: ['Default', 'Dark Mode'],
			themeIndex: 0
		}
	},
	onLoad() {
		// 初始化选择器的位置
		this.isDark = uni.getStorageSync('isDarkMode') || false;
		this.themeIndex = this.isDark ? 1 : 0;
	},
	methods: {
		onThemeChange(e) {
			this.themeIndex = e.detail.value;
			const isDark = this.themeIndex == 1;
			
			// 1. 持久化存储
			uni.setStorageSync('isDarkMode', isDark);
			// 2. 发送全局通知
			uni.$emit('themeChanged', isDark);
			
			uni.showToast({
				title: `Switched to ${this.themeOptions[this.themeIndex]}`,
				icon: 'none'
			});
		},
		checkUpdate() {
			uni.showLoading({ title: 'Checking...' });
			setTimeout(() => {
				uni.hideLoading();
				uni.showModal({ title: 'Update', content: 'Already up to date.', showCancel: false });
			}, 800);
		},
		handlePolicyClick(name) {
			uni.showToast({ title: `Opening ${name}...`, icon: 'none' });
		}
	}
}
</script>

<style>
/* 引入全局暗色样式适配 */
@import "@/common/dark-mode.css"; 

.container { background-color: #f5f7fa; min-height: 100vh; transition: all 0.3s; }
.header-bg { background: linear-gradient(135deg, #42b983 0%, #32a071 100%); padding: 100rpx 40rpx 80rpx; border-radius: 0 0 50rpx 50rpx; }
.page-title { font-size: 44rpx; font-weight: bold; color: #fff; }
.content-wrapper { margin-top: -40rpx; padding: 0 30rpx; }
.menu-card { background: #fff; border-radius: 24rpx; padding: 10rpx 30rpx; box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.03); }
.menu-item { display: flex; justify-content: space-between; align-items: center; padding: 35rpx 0; border-bottom: 1rpx solid #f0f0f0; }
.menu-item:last-child { border-bottom: none; }
.item-left { display: flex; align-items: center; }
.menu-icon { font-size: 36rpx; margin-right: 20rpx; }
.menu-text { font-size: 30rpx; color: #333; font-weight: 500; }
.status-text { font-size: 26rpx; color: #999; margin-right: 15rpx; }
.arrow { color: #bbb; font-size: 26rpx; }

/* 暗色模式局部适配 */
.dark-mode .menu-card { background: #2c2c2c; }
.dark-mode .menu-text { color: #e0e0e0; }
.dark-mode .menu-item { border-bottom-color: #3d3d3d; }
.dark-mode .header-bg { background: linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%); }
</style>