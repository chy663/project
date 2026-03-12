"use strict";
const common_vendor = require("../common/vendor.js");
const themeMixin = {
  data() {
    return {
      isDark: false
    };
  },
  onShow() {
    this.isDark = common_vendor.index.getStorageSync("isDarkMode") || false;
  },
  onLoad() {
    common_vendor.index.$on("themeChanged", (val) => {
      this.isDark = val;
    });
  },
  onUnload() {
    common_vendor.index.$off("themeChanged");
  }
};
exports.themeMixin = themeMixin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/mixins/theme.js.map
