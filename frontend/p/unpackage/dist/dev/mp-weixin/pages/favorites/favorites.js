"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
  data() {
    return {
      favoriteRooms: [],
      currentUserId: 1
    };
  },
  onShow() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && userInfo.id) {
      this.currentUserId = userInfo.id;
    }
    this.fetchFavoriteRooms();
  },
  methods: {
    fetchFavoriteRooms() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/favorites/user/${this.currentUserId}/rooms`,
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200) {
            this.favoriteRooms = Array.isArray(res.data) ? res.data : [];
          } else {
            this.favoriteRooms = [];
          }
        },
        fail: () => {
          this.favoriteRooms = [];
        }
      });
    },
    cancelFavorite(room, index) {
      const removedRoom = this.favoriteRooms.splice(index, 1)[0];
      common_vendor.index.request({
        url: "http://localhost:8089/api/favorites/toggle",
        method: "POST",
        data: { userId: this.currentUserId, roomId: room.id },
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.showToast({ title: "Removed", icon: "none" });
            this.fetchFavoriteRooms();
          } else {
            this.favoriteRooms.splice(index, 0, removedRoom);
            common_vendor.index.showToast({ title: "Failed to remove", icon: "none" });
          }
        },
        fail: () => {
          this.favoriteRooms.splice(index, 0, removedRoom);
          common_vendor.index.showToast({ title: "Network Error", icon: "none" });
        }
      });
    },
    goToRoomDetail(room) {
      common_vendor.index.navigateTo({
        url: `/pages/roomDetail/roomDetail?id=${room.id}&hotelId=${room.hotelId}`
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
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.favoriteRooms.length > 0
  }, $data.favoriteRooms.length > 0 ? {
    b: common_vendor.f($data.favoriteRooms, (room, index, i0) => {
      return {
        a: $options.getRoomImage(room),
        b: common_vendor.t(room.roomType),
        c: common_vendor.t(room.price),
        d: common_vendor.o(($event) => $options.cancelFavorite(room, index), index),
        e: index,
        f: common_vendor.o(($event) => $options.goToRoomDetail(room), index)
      };
    }),
    c: common_assets._imports_0$1
  } : {
    d: common_assets._imports_1
  }, {
    e: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/favorites/favorites.js.map
