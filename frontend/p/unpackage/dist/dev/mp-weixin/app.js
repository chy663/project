"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/order/order.js";
  "./pages/mine/mine.js";
  "./pages/detail/detail.js";
  "./pages/roomDetail/roomDetail.js";
  "./pages/login/login.js";
  "./pages/favorites/favorites.js";
  "./pages/guestList/guestList.js";
  "./pages/systemsetting/systemsetting.js";
  "./pages/accountsetting/accountsetting.js";
  "./pages/admin index/admin index.js";
  "./pages/admin mine/admin mine.js";
  "./pages/admin detail/admin detail.js";
  "./pages/admin edit/admin edit.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo) {
      if (userInfo.role === "Admin") {
        common_vendor.index.reLaunch({
          url: "/pages/admin index/admin index"
        });
      } else {
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      }
    } else {
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    }
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:28", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:31", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
