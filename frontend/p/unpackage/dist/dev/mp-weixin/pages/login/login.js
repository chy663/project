"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      isRegister: false,
      showPassword: false,
      form: {
        username: "",
        password: "",
        nickname: ""
      }
    };
  },
  methods: {
    handleToggle() {
      const currentPwd = this.form.password;
      this.showPassword = !this.showPassword;
      this.$nextTick(() => {
        this.form.password = currentPwd;
      });
    },
    handleSubmit() {
      if (!this.form.username || !this.form.password) {
        return common_vendor.index.showToast({ title: "Fill the form", icon: "none" });
      }
      const url = this.isRegister ? "/api/users/register" : "/api/users/login";
      common_vendor.index.request({
        url: "http://localhost:8089" + url,
        method: "POST",
        data: this.form,
        success: (res) => {
          if (res.statusCode === 200) {
            common_vendor.index.showToast({ title: "Success" });
            common_vendor.index.setStorageSync("userInfo", res.data);
            if (this.isRegister) {
              this.isRegister = false;
            } else {
              setTimeout(() => common_vendor.index.switchTab({ url: "/pages/index/index" }), 1500);
            }
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
    a: common_vendor.t($data.isRegister ? "Register Account" : "Welcome!"),
    b: $data.form.username,
    c: common_vendor.o(($event) => $data.form.username = $event.detail.value),
    d: !$data.showPassword
  }, !$data.showPassword ? {
    e: $data.form.password,
    f: common_vendor.o(($event) => $data.form.password = $event.detail.value)
  } : {
    g: $data.form.password,
    h: common_vendor.o(($event) => $data.form.password = $event.detail.value)
  }, {
    i: $data.showPassword ? "/static/可视密码.png" : "/static/隐藏密码.png",
    j: common_vendor.o((...args) => $options.handleToggle && $options.handleToggle(...args)),
    k: $data.isRegister
  }, $data.isRegister ? {
    l: $data.form.nickname,
    m: common_vendor.o(($event) => $data.form.nickname = $event.detail.value)
  } : {}, {
    n: common_vendor.t($data.isRegister ? "Register" : "Log in"),
    o: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args)),
    p: common_vendor.t($data.isRegister ? "Click to log in" : "Click to register"),
    q: common_vendor.o(($event) => $data.isRegister = !$data.isRegister)
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
