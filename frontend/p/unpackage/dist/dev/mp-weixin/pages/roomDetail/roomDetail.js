"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      roomId: null,
      hotelId: null,
      roomInfo: {},
      roomImages: [],
      isBookModalShow: false,
      guestName: "",
      guestPhone: "",
      // 新增评论列表
      reviews: []
    };
  },
  onLoad(options) {
    this.roomId = options.id;
    this.hotelId = options.hotelId;
    this.fetchRoomDetail();
    this.fetchReviews();
  },
  methods: {
    fetchRoomDetail() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/hotels/${this.hotelId}/rooms`,
        method: "GET",
        success: (res) => {
          const currentRoom = res.data.find((item) => item.id == this.roomId);
          if (currentRoom) {
            this.roomInfo = currentRoom;
            this.roomImages = this.getRoomImages(currentRoom);
          }
        }
      });
    },
    fetchReviews() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/reviews/room/${this.roomId}`,
        method: "GET",
        success: (res) => {
          this.reviews = res.data;
        }
      });
    },
    formatReviewDate(dateStr) {
      if (!dateStr)
        return "";
      return dateStr.replace("T", " ").substring(0, 10);
    },
    getRoomImages(room) {
      let mainImg = "/static/logo.png";
      const rt = room.roomType;
      if (rt.includes("Business"))
        mainImg = "/static/1-11.jpg";
      else if (rt.includes("Queen"))
        mainImg = "/static/2-11.jpg";
      else if (rt.includes("Family"))
        mainImg = "/static/3-11.jpg";
      else if (rt.includes("Work-friendly"))
        mainImg = "/static/1-22.jpg";
      return [mainImg, mainImg, mainImg];
    },
    openBookModal() {
      this.isBookModalShow = true;
    },
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
          roomId: this.roomInfo.id,
          status: "PAID",
          guestName: this.guestName,
          guestPhone: this.guestPhone
        },
        success: (orderRes) => {
          common_vendor.index.hideLoading();
          if (orderRes.statusCode === 200) {
            common_vendor.index.showToast({ title: "Success" });
            this.isBookModalShow = false;
            setTimeout(() => {
              common_vendor.index.switchTab({ url: "/pages/order/order" });
            }, 1500);
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.roomImages, (img, index, i0) => {
      return {
        a: img,
        b: index
      };
    }),
    b: common_vendor.t($data.roomInfo.roomType || "Room Details"),
    c: common_vendor.t($data.roomInfo.price),
    d: $data.roomInfo.maxPeople
  }, $data.roomInfo.maxPeople ? {
    e: common_vendor.t($data.roomInfo.maxPeople)
  } : {}, {
    f: common_vendor.t($data.roomInfo.totalInventory || 0),
    g: common_vendor.n($data.roomInfo.totalInventory > 0 ? "stock-green" : "stock-red"),
    h: common_vendor.t($data.roomInfo.roomType),
    i: common_vendor.t($data.roomInfo.maxPeople),
    j: common_vendor.t($data.reviews.length),
    k: $data.reviews.length > 0
  }, $data.reviews.length > 0 ? {
    l: common_vendor.f($data.reviews, (rev, index, i0) => {
      return {
        a: common_vendor.t(rev.userId || "001"),
        b: common_vendor.t($options.formatReviewDate(rev.createTime)),
        c: common_vendor.t(rev.content),
        d: index
      };
    })
  } : {}, {
    m: common_vendor.t($data.roomInfo.totalInventory > 0 ? "Book Now" : "Full"),
    n: $data.roomInfo.totalInventory <= 0 ? 1 : "",
    o: $data.roomInfo.totalInventory <= 0,
    p: common_vendor.o((...args) => $options.openBookModal && $options.openBookModal(...args)),
    q: $data.isBookModalShow
  }, $data.isBookModalShow ? {
    r: $data.guestName,
    s: common_vendor.o(($event) => $data.guestName = $event.detail.value),
    t: $data.guestPhone,
    v: common_vendor.o(($event) => $data.guestPhone = $event.detail.value),
    w: common_vendor.o(($event) => $data.isBookModalShow = false),
    x: common_vendor.o((...args) => $options.handleConfirmBook && $options.handleConfirmBook(...args)),
    y: common_vendor.o(() => {
    }),
    z: common_vendor.o(($event) => $data.isBookModalShow = false)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/roomDetail/roomDetail.js.map
