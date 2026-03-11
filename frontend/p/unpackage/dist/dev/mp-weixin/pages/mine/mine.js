"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      // 这里不再需要头像相关的变量
    };
  },
  methods: {
    handleLogout() {
      common_vendor.index.showModal({
        title: "Sign Out",
        content: "Are you sure you want to log out?",
        confirmColor: "#42b983",
        // 沿用首页的绿色
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({ title: "Logged out", icon: "none" });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/mine.js.map
