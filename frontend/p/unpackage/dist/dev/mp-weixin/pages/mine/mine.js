"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
  data() {
    return {
      userInfo: {}
    };
  },
  onShow() {
    this.userInfo = common_vendor.index.getStorageSync("userInfo") || {};
  },
  methods: {
    handleMenuClick(menuName) {
      if (menuName === "My Favorites") {
        common_vendor.index.navigateTo({ url: "/pages/favorites/favorites" });
      } else if (menuName === "Guest Information") {
        common_vendor.index.navigateTo({ url: "/pages/guestList/guestList" });
      } else if (menuName === "System Settings") {
        common_vendor.index.navigateTo({ url: "/pages/systemsetting/systemsetting" });
      } else if (menuName === "Account Settings") {
        common_vendor.index.navigateTo({ url: "/pages/accountsetting/accountsetting" });
      } else {
        common_vendor.index.showToast({ title: `Navigating to ${menuName}`, icon: "none" });
      }
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "Sign Out",
        content: "Are you sure?",
        cancelText: "Yes",
        cancelColor: "#42b983",
        confirmText: "No",
        success: (res) => {
          if (res.cancel) {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.reLaunch({ url: "/pages/login/login" });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: common_vendor.t($data.userInfo.nickname || $data.userInfo.username || "Please Sign In"),
    c: $data.userInfo.username
  }, $data.userInfo.username ? {} : {}, {
    d: common_vendor.o(($event) => $options.handleMenuClick("My Favorites")),
    e: common_vendor.o(($event) => $options.handleMenuClick("Guest Information")),
    f: common_vendor.o(($event) => $options.handleMenuClick("Account Settings")),
    g: common_vendor.o(($event) => $options.handleMenuClick("System Settings")),
    h: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args)),
    i: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/mine.js.map
