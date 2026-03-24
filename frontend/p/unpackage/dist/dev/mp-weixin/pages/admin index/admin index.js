"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      myHotel: {},
      isDark: false
    };
  },
  onShow() {
    this.isDark = common_vendor.index.getStorageSync("isDarkMode") || false;
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && userInfo.role && userInfo.role.toLowerCase() === "admin") {
      this.fetchMyHotel(userInfo.id);
    } else {
      common_vendor.index.reLaunch({
        url: userInfo ? "/pages/index/index" : "/pages/login/login"
      });
    }
  },
  methods: {
    fetchMyHotel(userId) {
      common_vendor.index.request({
        url: `http://localhost:8089/api/hotels/admin/${userId}`,
        success: (res) => {
          if (res.statusCode === 200) {
            this.myHotel = res.data;
          }
        }
      });
    },
    goToDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/admin detail/admin detail?id=${id}&isAdmin=true`
      });
    },
    goToMine() {
      common_vendor.index.reLaunch({ url: "/pages/admin mine/admin mine" });
    },
    getHotelImage(name) {
      if (name == null ? void 0 : name.includes("InterContinental"))
        return "/static/1.jpg";
      if (name == null ? void 0 : name.includes("Sunny Garden"))
        return "/static/2.jpg";
      if (name == null ? void 0 : name.includes("Neon Velvet"))
        return "/static/3.jpg";
      if (name == null ? void 0 : name.includes("Heritage"))
        return "/static/4.jpg";
      if (name == null ? void 0 : name.includes("Smart Stay"))
        return "/static/5.jpg";
      return "/static/logo.png";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.myHotel.id
  }, $data.myHotel.id ? {
    b: $options.getHotelImage($data.myHotel.name),
    c: common_vendor.t($data.myHotel.name),
    d: common_vendor.t($data.myHotel.rating),
    e: common_vendor.t($data.myHotel.address),
    f: common_vendor.t($data.myHotel.price),
    g: common_vendor.t($data.myHotel.category),
    h: common_vendor.o(($event) => $options.goToDetail($data.myHotel.id), "52")
  } : {}, {
    i: common_vendor.o((...args) => $options.goToMine && $options.goToMine(...args), "1f"),
    j: common_vendor.n($data.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9ba85480"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/admin index/admin index.js.map
