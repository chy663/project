"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
  data() {
    return {
      roomId: null,
      hotelId: null,
      roomInfo: {},
      roomImages: [],
      isBookModalShow: false,
      guestName: "",
      guestPhone: "",
      startDate: "",
      endDate: "",
      today: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      reviews: [],
      currentUserId: 1
    };
  },
  onLoad(options) {
    this.roomId = options.id;
    this.hotelId = options.hotelId;
    this.startDate = options.startDate || this.today;
    this.endDate = options.endDate || "";
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && userInfo.id) {
      this.currentUserId = userInfo.id;
    }
    this.fetchRoomDetail();
    this.fetchReviews();
    common_vendor.index.$on("onGuestSelect", (guest) => {
      this.guestName = guest.name;
      this.guestPhone = guest.phone;
    });
  },
  onUnload() {
    common_vendor.index.$off("onGuestSelect");
  },
  methods: {
    onStartDateChange(e) {
      this.startDate = e.detail.value;
      if (this.endDate && this.endDate <= this.startDate) {
        this.endDate = "";
      }
      this.fetchRoomDetail();
    },
    onEndDateChange(e) {
      this.endDate = e.detail.value;
      this.fetchRoomDetail();
    },
    fetchRoomDetail() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/rooms/hotel/${this.hotelId}`,
        method: "GET",
        data: {
          startDate: this.startDate,
          endDate: this.endDate
        },
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
      if (rt.includes("King"))
        mainImg = "/static/1-11.jpg";
      else if (rt.includes("Business"))
        mainImg = "/static/1-22.jpg";
      else if (rt.includes("Family"))
        mainImg = "/static/2-11.jpg";
      else if (rt.includes("Deluxe"))
        mainImg = "/static/2-22.jpg";
      else if (rt.includes("Neon"))
        mainImg = "/static/3-11.jpg";
      else if (rt.includes("Velvet"))
        mainImg = "/static/3-22.jpg";
      else if (rt.includes("One"))
        mainImg = "/static/4-22.jpg";
      else if (rt.includes("Studio"))
        mainImg = "/static/4-11.jpg";
      else if (rt.includes("4"))
        mainImg = "/static/5-11.jpg";
      else if (rt.includes("Double"))
        mainImg = "/static/5-22.jpg";
      return [mainImg, mainImg, mainImg];
    },
    openBookModal() {
      this.isBookModalShow = true;
    },
    goToSelectGuest() {
      common_vendor.index.navigateTo({
        url: "/pages/guestList/guestList?mode=select"
      });
    },
    handleConfirmBook() {
      if (!this.guestName || !this.guestPhone || !this.startDate || !this.endDate) {
        common_vendor.index.showToast({ title: "Please complete info", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "Processing..." });
      common_vendor.index.request({
        url: "http://localhost:8089/api/orders",
        method: "POST",
        data: {
          userId: this.currentUserId,
          roomId: this.roomInfo.id,
          hotelId: this.hotelId,
          status: "PAID",
          guestName: this.guestName,
          guestPhone: this.guestPhone,
          checkInDate: this.startDate,
          checkOutDate: this.endDate,
          totalPrice: this.roomInfo.price
        },
        success: (orderRes) => {
          common_vendor.index.hideLoading();
          if (orderRes.statusCode === 200) {
            common_vendor.index.showToast({ title: "Success" });
            this.isBookModalShow = false;
            setTimeout(() => {
              common_vendor.index.switchTab({ url: "/pages/order/order" });
            }, 1500);
          } else {
            common_vendor.index.showToast({ title: "Room inventory is full for the selected dates", icon: "none", duration: 2500 });
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
    f: common_vendor.t($data.roomInfo.roomType),
    g: common_vendor.t($data.roomInfo.maxPeople),
    h: common_vendor.t($data.reviews.length),
    i: $data.reviews.length > 0
  }, $data.reviews.length > 0 ? {
    j: common_vendor.f($data.reviews, (rev, index, i0) => {
      return {
        a: common_vendor.t(rev.userId || "001"),
        b: common_vendor.t($options.formatReviewDate(rev.createTime)),
        c: common_vendor.t(rev.content),
        d: index
      };
    })
  } : {}, {
    k: common_vendor.o((...args) => $options.openBookModal && $options.openBookModal(...args), "16"),
    l: $data.isBookModalShow
  }, $data.isBookModalShow ? {
    m: common_vendor.o((...args) => $options.goToSelectGuest && $options.goToSelectGuest(...args), "e3"),
    n: $data.guestName,
    o: common_vendor.o(($event) => $data.guestName = $event.detail.value, "ea"),
    p: $data.guestPhone,
    q: common_vendor.o(($event) => $data.guestPhone = $event.detail.value, "74"),
    r: common_vendor.t($data.startDate || "Select Date"),
    s: $data.startDate,
    t: $data.today,
    v: common_vendor.o((...args) => $options.onStartDateChange && $options.onStartDateChange(...args), "3c"),
    w: common_vendor.t($data.endDate || "Select Date"),
    x: $data.endDate,
    y: $data.startDate || $data.today,
    z: common_vendor.o((...args) => $options.onEndDateChange && $options.onEndDateChange(...args), "39"),
    A: common_vendor.o(($event) => $data.isBookModalShow = false, "3d"),
    B: common_vendor.o((...args) => $options.handleConfirmBook && $options.handleConfirmBook(...args), "14"),
    C: common_vendor.o(() => {
    }, "b9"),
    D: common_vendor.o(($event) => $data.isBookModalShow = false, "ca")
  } : {}, {
    E: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/roomDetail/roomDetail.js.map
