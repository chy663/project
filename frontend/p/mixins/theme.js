// mixins/theme.js
export const themeMixin = {
    data() {
        return {
            isDark: false
        }
    },
    onShow() {
        // 每次进入页面时同步一次最新的暗色状态
        this.isDark = uni.getStorageSync('isDarkMode') || false;
    },
    onLoad() {
        // 监听来自设置页面的实时切换信号
        uni.$on('themeChanged', (val) => {
            this.isDark = val;
        });
    },
    onUnload() {
        uni.$off('themeChanged');
    }
}