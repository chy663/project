<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			// 核心逻辑：登录身份检查与分流
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				// 如果已经登录，根据身份强行重定向，防止留在错误的首页
				if (userInfo.role === 'Admin') {
					uni.reLaunch({
						url: '/pages/admin index/admin index'
					});
				} else {
                    // 如果是普通用户，可以确保他在用户首页
                    uni.reLaunch({
                        url: '/pages/index/index'
                    });
                }
			} else {
                // 如果没有登录信息，跳转到登录页
                uni.reLaunch({
                    url: '/pages/login/login'
                });
            }
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