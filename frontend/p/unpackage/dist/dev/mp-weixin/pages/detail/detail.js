"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      hotelId: null,
      hotelName: "Hotel Details",
      hotelImage: "/static/1.jpg",
      roomList: [],
      // 弹窗相关
      isBookModalShow: false,
      selectedRoom: null,
      guestName: "",
      guestPhone: ""
    };
  },
  onLoad(options) {
    this.hotelId = options.id;
    this.hotelImage = `/static/${options.id}.jpg`;
    this.fetchRoomData();
  },
  methods: {
    goToRoomDetail(room) {
      common_vendor.index.navigateTo({
        url: `/pages/roomDetail/roomDetail?id=${room.id}&hotelId=${this.hotelId}`
      });
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
    getRoomImage(room) {
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
    },
    // 打开信息填写弹窗
    openBookModal(room) {
      this.selectedRoom = room;
      this.isBookModalShow = true;
    },
    // 提交预订
    handleConfirmBook() {
      if (!this.guestName || !this.guestPhone) {
        common_vendor.index.showToast({ title: "Please complete info", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "Processing..." });
      common_vendor.index.request({
        url: "http://localhost:8089/api/orders/book",
        method: "POST",
        data: {
          userId: 1,
          // 模拟当前登录用户
          roomId: this.selectedRoom.id,
          status: "PAID",
          guestName: this.guestName,
          // 发送至后端保存
          guestPhone: this.guestPhone
          // 发送至后端保存
        },
        success: (orderRes) => {
          common_vendor.index.hideLoading();
          if (orderRes.statusCode === 200) {
            common_vendor.index.showToast({ title: "Success", icon: "success" });
            this.isBookModalShow = false;
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
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
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
        g: common_vendor.t(room.totalInventory > 0 ? "Book" : "Full"),
        h: room.totalInventory <= 0 ? 1 : "",
        i: room.totalInventory <= 0,
        j: common_vendor.o(($event) => $options.openBookModal(room), index),
        k: index,
        l: common_vendor.o(($event) => $options.goToRoomDetail(room), index)
      };
    }),
    d: $data.isBookModalShow
  }, $data.isBookModalShow ? {
    e: $data.guestName,
    f: common_vendor.o(($event) => $data.guestName = $event.detail.value),
    g: $data.guestPhone,
    h: common_vendor.o(($event) => $data.guestPhone = $event.detail.value),
    i: common_vendor.o(($event) => $data.isBookModalShow = false),
    j: common_vendor.o((...args) => $options.handleConfirmBook && $options.handleConfirmBook(...args)),
    k: common_vendor.o(() => {
    }),
    l: common_vendor.o(($event) => $data.isBookModalShow = false)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
