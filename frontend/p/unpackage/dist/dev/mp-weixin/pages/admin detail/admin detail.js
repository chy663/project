"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
  data() {
    return {
      hotelId: null,
      hotelName: "Loading...",
      hotelImage: "/static/1.jpg",
      roomList: [],
      currentUserId: null
    };
  },
  onLoad(options) {
    this.hotelId = options.id;
    this.hotelImage = `/static/${options.id}.jpg`;
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo) {
      this.currentUserId = userInfo.id;
    }
    this.fetchHotelInfo();
    this.fetchRoomData();
  },
  methods: {
    fetchHotelInfo() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/hotels/${this.hotelId}`,
        method: "GET",
        success: (res) => {
          this.hotelName = res.data.name;
        }
      });
    },
    fetchRoomData() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/rooms/hotel/${this.hotelId}`,
        method: "GET",
        success: (res) => {
          this.roomList = res.data;
        }
      });
    },
    goToEditRoom(room) {
      common_vendor.index.navigateTo({
        url: `/pages/admin edit/admin edit?id=${room.id}&hotelId=${this.hotelId}`
      });
    },
    getRoomImage(room) {
      if (!room || !room.roomType)
        return "/static/logo.png";
      const rt = room.roomType;
      if (rt.includes("Business"))
        return "/static/1-11.jpg";
      if (rt.includes("Work-friendly"))
        return "/static/1-22.jpg";
      if (rt.includes("Queen"))
        return "/static/2-11.jpg";
      if (rt.includes("Romantic"))
        return "/static/2-22.jpg";
      if (rt.includes("Designer"))
        return "/static/2-33.jpg";
      if (rt.includes("Family"))
        return "/static/3-11.jpg";
      if (rt.includes("Child"))
        return "/static/3-22.jpg";
      if (rt.includes("Studio"))
        return "/static/4-11.jpg";
      if (rt.includes("Space"))
        return "/static/4-22.jpg";
      if (rt.includes("Budget"))
        return "/static/5-11.jpg";
      if (rt.includes("Bunk"))
        return "/static/5-22.jpg";
      if (rt.includes("Student"))
        return "/static/5-33.jpg";
      return "/static/logo.png";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.hotelImage,
    b: common_vendor.t($data.hotelName),
    c: common_vendor.f($data.roomList, (room, index, i0) => {
      return {
        a: $options.getRoomImage(room),
        b: common_vendor.t(room.roomType),
        c: common_vendor.t(room.totalInventory || 0),
        d: common_vendor.n(room.totalInventory > 0 ? "stock-green" : "stock-red"),
        e: common_vendor.t(room.price),
        f: common_vendor.t(room.maxPeople),
        g: common_vendor.o(($event) => $options.goToEditRoom(room), index),
        h: index
      };
    }),
    d: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d9cb30bc"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/admin detail/admin detail.js.map
