"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {},
      isDark: false
    };
  },
  onShow() {
    this.isDark = common_vendor.index.getStorageSync("isDarkMode") || false;
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    common_vendor.index.__f__("log", "at pages/admin mine/admin mine.vue:66", "Current User Info:", userInfo);
    if (!userInfo || !userInfo.id) {
      common_vendor.index.reLaunch({ url: "/pages/login/login" });
      return;
    }
    if (userInfo.role && userInfo.role.toLowerCase() === "admin") {
      this.userInfo = userInfo;
    } else {
      common_vendor.index.reLaunch({ url: "/pages/index/index" });
    }
  },
  methods: {
    goToHome() {
      common_vendor.index.reLaunch({ url: "/pages/admin index/admin index" });
    },
    handleMenuClick(menuName) {
      if (menuName === "System Settings") {
        common_vendor.index.navigateTo({ url: "/pages/systemsetting/systemsetting" });
      } else if (menuName === "Account Settings") {
        common_vendor.index.navigateTo({ url: "/pages/accountsetting/accountsetting" });
      }
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "Sign Out",
        content: "Are you sure?",
        cancelText: "Yes",
        confirmText: "No",
        success: (res) => {
          if (res.confirm)
            ;
          else {
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
    d: common_vendor.o(($event) => $options.handleMenuClick("Account Settings")),
    e: common_vendor.o(($event) => $options.handleMenuClick("System Settings")),
    f: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args)),
    g: common_vendor.o((...args) => $options.goToHome && $options.goToHome(...args)),
    h: common_vendor.n($data.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d1de4ace"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/admin mine/admin mine.js.map
