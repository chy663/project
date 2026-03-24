"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
  data() {
    return {
      currentVersion: "1.0.2",
      themeOptions: ["Default", "Dark Mode"],
      themeIndex: 0
    };
  },
  onLoad() {
    this.isDark = common_vendor.index.getStorageSync("isDarkMode") || false;
    this.themeIndex = this.isDark ? 1 : 0;
  },
  methods: {
    onThemeChange(e) {
      this.themeIndex = e.detail.value;
      const isDark = this.themeIndex == 1;
      common_vendor.index.setStorageSync("isDarkMode", isDark);
      common_vendor.index.$emit("themeChanged", isDark);
      common_vendor.index.showToast({
        title: `Switched to ${this.themeOptions[this.themeIndex]}`,
        icon: "none"
      });
    },
    checkUpdate() {
      common_vendor.index.showLoading({ title: "Checking..." });
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showModal({ title: "Update", content: "Already up to date.", showCancel: false });
      }, 800);
    },
    handlePolicyClick(name) {
      common_vendor.index.showToast({ title: `Opening ${name}...`, icon: "none" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.themeOptions[$data.themeIndex]),
    b: common_vendor.o((...args) => $options.onThemeChange && $options.onThemeChange(...args), "09"),
    c: $data.themeIndex,
    d: $data.themeOptions,
    e: common_vendor.t($data.currentVersion),
    f: common_vendor.o((...args) => $options.checkUpdate && $options.checkUpdate(...args), "74"),
    g: common_vendor.o(($event) => $options.handlePolicyClick("Privacy Policy"), "1a"),
    h: common_vendor.o(($event) => $options.handlePolicyClick("User Agreement"), "8d"),
    i: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/systemsetting/systemsetting.js.map
