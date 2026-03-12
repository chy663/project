"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
  data() {
    return {
      guestList: [],
      newName: "",
      newPhone: "",
      isSelectMode: false,
      currentUserId: 1
    };
  },
  onLoad(options) {
    if (options.mode === "select") {
      this.isSelectMode = true;
    }
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && userInfo.id) {
      this.currentUserId = userInfo.id;
    }
    this.loadGuests();
  },
  methods: {
    loadGuests() {
      const saved = common_vendor.index.getStorageSync(`guestList_${this.currentUserId}`);
      if (saved) {
        this.guestList = saved;
      }
    },
    addGuest() {
      if (!this.newName.trim() || !this.newPhone.trim()) {
        common_vendor.index.showToast({ title: "Please fill all fields", icon: "none" });
        return;
      }
      this.guestList.push({
        name: this.newName.trim(),
        phone: this.newPhone.trim()
      });
      common_vendor.index.setStorageSync(`guestList_${this.currentUserId}`, this.guestList);
      this.newName = "";
      this.newPhone = "";
      common_vendor.index.showToast({ title: "Saved successfully", icon: "success" });
    },
    deleteGuest(index) {
      common_vendor.index.showModal({
        title: "Delete Guest",
        content: "Are you sure?",
        success: (res) => {
          if (res.confirm) {
            this.guestList.splice(index, 1);
            common_vendor.index.setStorageSync(`guestList_${this.currentUserId}`, this.guestList);
          }
        }
      });
    },
    handleSelectGuest(guest) {
      if (this.isSelectMode) {
        common_vendor.index.$emit("onGuestSelect", guest);
        common_vendor.index.navigateBack();
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.isSelectMode
  }, $data.isSelectMode ? {} : {}, {
    b: $data.guestList.length > 0
  }, $data.guestList.length > 0 ? {
    c: common_vendor.f($data.guestList, (guest, index, i0) => {
      return {
        a: common_vendor.t(guest.name),
        b: common_vendor.t(guest.phone),
        c: common_vendor.o(($event) => $options.handleSelectGuest(guest), index),
        d: common_vendor.o(($event) => $options.deleteGuest(index), index),
        e: index
      };
    })
  } : {}, {
    d: $data.newName,
    e: common_vendor.o(($event) => $data.newName = $event.detail.value),
    f: $data.newPhone,
    g: common_vendor.o(($event) => $data.newPhone = $event.detail.value),
    h: common_vendor.o((...args) => $options.addGuest && $options.addGuest(...args)),
    i: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/guestList/guestList.js.map
