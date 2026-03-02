"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      hotelId: null,
      roomList: [],
      hotelImage: "/static/1.jpg"
    };
  },
  onLoad(options) {
    if (options.id) {
      this.hotelId = options.id;
      this.hotelImage = `/static/${options.id}.jpg`;
      this.fetchRoomData();
    }
  },
  methods: {
    getRoomImage(type) {
      if (!type)
        return "/static/logo.png";
      const name = type.toLowerCase();
      if (name.includes("business"))
        return "/static/1-1.jpg";
      if (name.includes("work"))
        return "/static/1-2.jpg";
      if (name.includes("queen"))
        return "/static/2-1.jpg";
      if (name.includes("romantic"))
        return "/static/2-2.jpg";
      if (name.includes("studio"))
        return "/static/2-3.jpg";
      if (name.includes("garden"))
        return "/static/3-1.jpg";
      if (name.includes("twin"))
        return "/static/3-2.jpg";
      if (name.includes("long"))
        return "/static/4-1.jpg";
      if (name.includes("space"))
        return "/static/4-2.jpg";
      if (name.includes("budget"))
        return "/static/5-1.jpg";
      if (name.includes("bunk"))
        return "/static/5-2.jpg";
      if (name.includes("student"))
        return "/static/5-3.jpg";
      return "/static/logo.png";
    },
    fetchRoomData() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/hotels/${this.hotelId}/rooms`,
        method: "GET",
        success: (res) => {
          this.roomList = res.data;
        }
      });
    },
    handleBook(room) {
      if (!room.isAvailable || (room.totalInventory || 0) <= 0)
        return;
      common_vendor.index.showModal({
        title: "Confirm Booking",
        content: `Book ${room.roomType} for up to ${room.maxPeople} guests?`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({ title: "Success", icon: "success" });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.hotelImage,
    b: common_vendor.f($data.roomList, (room, k0, i0) => {
      return {
        a: $options.getRoomImage(room.roomType),
        b: common_vendor.t(room.roomType),
        c: common_vendor.t(room.maxPeople || 2),
        d: common_vendor.t(room.totalInventory || 0),
        e: (room.totalInventory || 10) < 3 ? 1 : "",
        f: common_vendor.t(room.price),
        g: common_vendor.t(room.isAvailable && (room.totalInventory || 0) > 0 ? "Book" : "Full"),
        h: !room.isAvailable || (room.totalInventory || 0) <= 0 ? 1 : "",
        i: common_vendor.o(($event) => $options.handleBook(room), room.id),
        j: room.id
      };
    }),
    c: $data.roomList.length === 0
  }, $data.roomList.length === 0 ? {} : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
