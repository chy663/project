<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 全局过渡效果 */
	view, scroll-view {
		transition: background-color 0.3s ease, color 0.3s ease;
	}

	/* 强制暗色背景类 */
	.dark-mode {
		background-color: #1a1a1a !important;
		color: #e0e0e0 !important;
	}
</style>
