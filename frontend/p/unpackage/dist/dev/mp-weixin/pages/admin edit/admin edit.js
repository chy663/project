"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isDark: false,
      roomId: null,
      hotelId: null,
      roomForm: {
        roomType: "",
        price: "",
        maxPeople: "",
        totalInventory: 0
        // 保持原始值
      }
    };
  },
  onLoad(options) {
    this.isDark = common_vendor.index.getStorageSync("isDarkMode") || false;
    this.roomId = options.id;
    this.hotelId = options.hotelId;
    this.fetchRoomInfo();
  },
  methods: {
    fetchRoomInfo() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/rooms/${this.roomId}`,
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200) {
            this.roomForm = res.data;
          }
        }
      });
    },
    submitUpdate() {
      if (!this.roomForm.price || !this.roomForm.maxPeople) {
        common_vendor.index.showToast({ title: "Please fill all fields", icon: "none" });
        return;
      }
      common_vendor.index.request({
        url: `http://localhost:8089/api/rooms/${this.roomId}`,
        method: "PUT",
        data: {
          price: parseFloat(this.roomForm.price),
          maxPeople: parseInt(this.roomForm.maxPeople),
          roomType: this.roomForm.roomType,
          totalInventory: this.roomForm.totalInventory
        },
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.showToast({ title: "Updated Successfully" });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          } else {
            common_vendor.index.showToast({ title: "Update Failed", icon: "none" });
          }
        }
      });
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.roomForm.roomType),
    b: $data.roomForm.price,
    c: common_vendor.o(($event) => $data.roomForm.price = $event.detail.value, "29"),
    d: $data.roomForm.maxPeople,
    e: common_vendor.o(($event) => $data.roomForm.maxPeople = $event.detail.value, "30"),
    f: common_vendor.o((...args) => $options.submitUpdate && $options.submitUpdate(...args), "64"),
    g: common_vendor.o((...args) => $options.goBack && $options.goBack(...args), "fa"),
    h: common_vendor.n($data.isDark ? "dark-mode" : "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1d801c42"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/admin edit/admin edit.js.map
