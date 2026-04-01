"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
  data() {
    return {
      hotelId: null,
      hotelName: "Hotel Details",
      hotelDescription: "",
      hotelImage: "/static/1.jpg",
      roomList: [],
      isBookModalShow: false,
      selectedRoom: null,
      guestName: "",
      guestPhone: "",
      startDate: "",
      endDate: "",
      today: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      favoriteRoomIds: [],
      currentUserId: 1
    };
  },
  onLoad(options) {
    this.hotelId = options.id;
    this.hotelImage = `/static/${options.id}.jpg`;
    this.startDate = options.startDate || this.today;
    this.endDate = options.endDate || "";
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && userInfo.id) {
      this.currentUserId = userInfo.id;
    }
    this.fetchHotelDetail();
    this.fetchRoomData();
    this.fetchFavoriteRoomIds();
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
      this.fetchRoomData();
    },
    onEndDateChange(e) {
      this.endDate = e.detail.value;
      this.fetchRoomData();
    },
    fetchHotelDetail() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/hotels/${this.hotelId}`,
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.hotelName = res.data.name;
            this.hotelDescription = res.data.description;
          }
        }
      });
    },
    goToRoomDetail(room) {
      common_vendor.index.navigateTo({
        url: `/pages/roomDetail/roomDetail?id=${room.id}&hotelId=${this.hotelId}&startDate=${this.startDate}&endDate=${this.endDate}`
      });
    },
    fetchRoomData() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/rooms/hotel/${this.hotelId}`,
        method: "GET",
        data: {
          startDate: this.startDate,
          endDate: this.endDate
        },
        success: (res) => {
          this.roomList = res.data;
        }
      });
    },
    fetchFavoriteRoomIds() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/favorites/user/${this.currentUserId}/roomIds`,
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200) {
            this.favoriteRoomIds = Array.isArray(res.data) ? res.data : [];
          } else {
            this.favoriteRoomIds = [];
          }
        }
      });
    },
    toggleFavorite(room) {
      common_vendor.index.request({
        url: "http://localhost:8089/api/favorites/toggle",
        method: "POST",
        data: {
          userId: this.currentUserId,
          roomId: room.id
        },
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.showToast({ title: res.data === "Added" ? "Collected" : "Removed", icon: "none" });
            this.fetchFavoriteRoomIds();
          }
        }
      });
    },
    getRoomImage(room) {
      if (!room || !room.roomType)
        return "/static/logo.png";
      const rt = room.roomType;
      if (rt.includes("King"))
        return "/static/1-11.jpg";
      if (rt.includes("Business"))
        return "/static/1-22.jpg";
      if (rt.includes("Family"))
        return "/static/2-11.jpg";
      if (rt.includes("Deluxe"))
        return "/static/2-22.jpg";
      if (rt.includes("Neon"))
        return "/static/3-11.jpg";
      if (rt.includes("Velvet"))
        return "/static/3-22.jpg";
      if (rt.includes("One"))
        return "/static/4-11.jpg";
      if (rt.includes("Studio"))
        return "/static/4-22.jpg";
      if (rt.includes("4"))
        return "/static/5-11.jpg";
      if (rt.includes("Double"))
        return "/static/5-22.jpg";
      return "/static/logo.png";
    },
    openBookModal(room) {
      this.selectedRoom = room;
      this.isBookModalShow = true;
    },
    goToSelectGuest() {
      common_vendor.index.navigateTo({
        url: "/pages/guestList/guestList?mode=select"
      });
    },
    handleConfirmBook() {
      if (!this.guestName || !this.guestPhone || !this.startDate || !this.endDate) {
        common_vendor.index.showToast({ title: "Please complete all info", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "Processing..." });
      common_vendor.index.request({
        url: "http://localhost:8089/api/orders",
        method: "POST",
        data: {
          userId: this.currentUserId,
          roomId: this.selectedRoom.id,
          hotelId: this.hotelId,
          status: "PAID",
          guestName: this.guestName,
          guestPhone: this.guestPhone,
          checkInDate: this.startDate,
          checkOutDate: this.endDate,
          totalPrice: this.selectedRoom.price
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
            common_vendor.index.showToast({ title: "Room inventory is full for the selected dates", icon: "none", duration: 2500 });
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
    c: common_vendor.t($data.hotelDescription || "No description available."),
    d: common_vendor.f($data.roomList, (room, index, i0) => {
      return {
        a: $options.getRoomImage(room),
        b: common_vendor.t(room.roomType),
        c: common_vendor.t(room.price),
        d: common_vendor.t(room.maxPeople),
        e: ($data.favoriteRoomIds || []).includes(Number(room.id)) ? "/static/已收藏.png" : "/static/收藏.png",
        f: common_vendor.o(($event) => $options.toggleFavorite(room), index),
        g: common_vendor.o(($event) => $options.openBookModal(room), index),
        h: index,
        i: common_vendor.o(($event) => $options.goToRoomDetail(room), index)
      };
    }),
    e: $data.isBookModalShow
  }, $data.isBookModalShow ? {
    f: common_vendor.o((...args) => $options.goToSelectGuest && $options.goToSelectGuest(...args), "57"),
    g: $data.guestName,
    h: common_vendor.o(($event) => $data.guestName = $event.detail.value, "22"),
    i: $data.guestPhone,
    j: common_vendor.o(($event) => $data.guestPhone = $event.detail.value, "3e"),
    k: common_vendor.t($data.startDate || "Select Date"),
    l: $data.startDate,
    m: $data.today,
    n: common_vendor.o((...args) => $options.onStartDateChange && $options.onStartDateChange(...args), "48"),
    o: common_vendor.t($data.endDate || "Select Date"),
    p: $data.endDate,
    q: $data.startDate || $data.today,
    r: common_vendor.o((...args) => $options.onEndDateChange && $options.onEndDateChange(...args), "c1"),
    s: common_vendor.o(($event) => $data.isBookModalShow = false, "29"),
    t: common_vendor.o((...args) => $options.handleConfirmBook && $options.handleConfirmBook(...args), "84"),
    v: common_vendor.o(() => {
    }, "d1"),
    w: common_vendor.o(($event) => $data.isBookModalShow = false, "6e")
  } : {}, {
    x: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
