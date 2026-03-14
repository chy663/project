"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
  data() {
    return {
      hotelId: null,
      hotelName: "Hotel Details",
      hotelImage: "/static/1.jpg",
      roomList: [],
      isBookModalShow: false,
      selectedRoom: null,
      guestName: "",
      guestPhone: "",
      favoriteRoomIds: [],
      currentUserId: 1
    };
  },
  onLoad(options) {
    this.hotelId = options.id;
    this.hotelImage = `/static/${options.id}.jpg`;
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && userInfo.id) {
      this.currentUserId = userInfo.id;
    }
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
    goToRoomDetail(room) {
      common_vendor.index.navigateTo({
        url: `/pages/roomDetail/roomDetail?id=${room.id}&hotelId=${this.hotelId}`
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
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/detail/detail.vue:138", "Failed to fetch favorite room IDs", err);
          this.favoriteRoomIds = [];
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
      if (!room || !room.roomType) {
        return "/static/logo.png";
      }
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
      if (!this.guestName || !this.guestPhone) {
        common_vendor.index.showToast({ title: "Please complete info", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "Processing..." });
      common_vendor.index.request({
        url: "http://localhost:8089/api/orders/book",
        method: "POST",
        data: {
          userId: this.currentUserId,
          roomId: this.selectedRoom.id,
          status: "PAID",
          guestName: this.guestName,
          guestPhone: this.guestPhone
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
        g: ($data.favoriteRoomIds || []).includes(Number(room.id)) ? "/static/已收藏.png" : "/static/收藏.png",
        h: common_vendor.o(($event) => $options.toggleFavorite(room), index),
        i: common_vendor.t(room.totalInventory > 0 ? "Book" : "Full"),
        j: room.totalInventory <= 0 ? 1 : "",
        k: room.totalInventory <= 0,
        l: common_vendor.o(($event) => $options.openBookModal(room), index),
        m: index,
        n: common_vendor.o(($event) => $options.goToRoomDetail(room), index)
      };
    }),
    d: $data.isBookModalShow
  }, $data.isBookModalShow ? {
    e: common_vendor.o((...args) => $options.goToSelectGuest && $options.goToSelectGuest(...args)),
    f: $data.guestName,
    g: common_vendor.o(($event) => $data.guestName = $event.detail.value),
    h: $data.guestPhone,
    i: common_vendor.o(($event) => $data.guestPhone = $event.detail.value),
    j: common_vendor.o(($event) => $data.isBookModalShow = false),
    k: common_vendor.o((...args) => $options.handleConfirmBook && $options.handleConfirmBook(...args)),
    l: common_vendor.o(() => {
    }),
    m: common_vendor.o(($event) => $data.isBookModalShow = false)
  } : {}, {
    n: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
