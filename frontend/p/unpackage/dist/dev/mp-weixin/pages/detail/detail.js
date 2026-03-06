"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      hotelId: null,
      hotelName: "Hotel Details",
      hotelImage: "/static/1.jpg",
      roomList: []
    };
  },
  onLoad(options) {
    this.hotelId = options.id;
    this.hotelImage = `/static/${options.id}.jpg`;
    this.fetchRoomData();
  },
  methods: {
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
      if (!room.totalInventory || room.totalInventory <= 0)
        return;
      common_vendor.index.showModal({
        title: "Confirm Booking",
        content: `Total: $${room.price}. Confirm payment for ${room.roomType}?`,
        confirmText: "Pay",
        cancelText: "Cancel",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "Processing..." });
            common_vendor.index.request({
              url: "http://localhost:8089/api/orders/book",
              method: "POST",
              data: {
                userId: 1,
                roomId: room.id,
                status: "PAID"
              },
              success: (orderRes) => {
                common_vendor.index.hideLoading();
                if (orderRes.statusCode === 200) {
                  common_vendor.index.showToast({ title: "Success", icon: "success" });
                  this.fetchRoomData();
                  setTimeout(() => {
                    common_vendor.index.switchTab({ url: "/pages/order/order" });
                  }, 1500);
                } else {
                  common_vendor.index.showToast({ title: "Failed", icon: "none" });
                }
              }
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.hotelImage,
    b: common_vendor.t($data.hotelName),
    c: common_vendor.f($data.roomList, (room, index, i0) => {
      return {
        a: common_vendor.t(room.roomType),
        b: common_vendor.t(room.totalInventory || 0),
        c: common_vendor.n(room.totalInventory > 0 ? "stock-green" : "stock-red"),
        d: common_vendor.t(room.price),
        e: common_vendor.t(room.maxPeople),
        f: common_vendor.t(room.totalInventory > 0 ? "Book" : "Full"),
        g: room.totalInventory <= 0 ? 1 : "",
        h: room.totalInventory <= 0,
        i: common_vendor.o(($event) => $options.handleBook(room), index),
        j: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
