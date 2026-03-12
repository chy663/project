"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
  data() {
    return {
      userId: null,
      nickname: "",
      pwdForm: { oldPassword: "", newPassword: "" }
    };
  },
  onLoad() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo) {
      this.userId = userInfo.id;
      this.nickname = userInfo.nickname || userInfo.username;
    }
  },
  methods: {
    handleUpdateProfile() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/users/${this.userId}/profile`,
        method: "PUT",
        data: { nickname: this.nickname },
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.setStorageSync("userInfo", res.data);
            common_vendor.index.showToast({ title: "Name Updated" });
          }
        }
      });
    },
    handleChangePassword() {
      if (!this.pwdForm.oldPassword || !this.pwdForm.newPassword) {
        return common_vendor.index.showToast({ title: "Please fill all fields", icon: "none" });
      }
      common_vendor.index.request({
        url: `http://localhost:8089/api/users/${this.userId}/password`,
        method: "PUT",
        data: this.pwdForm,
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.showToast({ title: "Password Changed" });
            this.pwdForm = { oldPassword: "", newPassword: "" };
          } else {
            common_vendor.index.showToast({ title: res.data, icon: "none" });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.nickname,
    b: common_vendor.o(($event) => $data.nickname = $event.detail.value),
    c: common_vendor.o((...args) => $options.handleUpdateProfile && $options.handleUpdateProfile(...args)),
    d: $data.pwdForm.oldPassword,
    e: common_vendor.o(($event) => $data.pwdForm.oldPassword = $event.detail.value),
    f: $data.pwdForm.newPassword,
    g: common_vendor.o(($event) => $data.pwdForm.newPassword = $event.detail.value),
    h: common_vendor.o((...args) => $options.handleChangePassword && $options.handleChangePassword(...args)),
    i: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/accountsetting/accountsetting.js.map
