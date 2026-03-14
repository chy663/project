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
    // 切换登录/注册模式时清空表单
    toggleMode() {
      this.isRegister = !this.isRegister;
      this.form.username = "";
      this.form.password = "";
      this.form.nickname = "";
    },
    handleToggle() {
      const currentPwd = this.form.password;
      this.showPassword = !this.showPassword;
      this.$nextTick(() => {
        this.form.password = currentPwd;
      });
    },
    handleSubmit() {
      if (!this.form.username || !this.form.password) {
        return common_vendor.index.showToast({ title: "Please fill all fields", icon: "none" });
      }
      const url = this.isRegister ? "/api/users/register" : "/api/users/login";
      common_vendor.index.request({
        url: "http://localhost:8089" + url,
        method: "POST",
        data: this.form,
        success: (res) => {
          if (res.statusCode === 200) {
            if (this.isRegister) {
              common_vendor.index.showToast({ title: "Register Success!" });
              this.isRegister = false;
            } else {
              const userInfo = res.data;
              common_vendor.index.setStorageSync("userInfo", userInfo);
              common_vendor.index.showToast({ title: "Login Success" });
              setTimeout(() => {
                if (userInfo.role === "ADMIN") {
                  common_vendor.index.reLaunch({
                    url: "/pages/admin index/admin index"
                  });
                } else {
                  common_vendor.index.switchTab({
                    url: "/pages/index/index"
                  });
                }
              }, 1500);
            }
          } else {
            common_vendor.index.showToast({
              title: res.data || "Operation Failed",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.showToast({ title: "Server Error", icon: "none" });
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
    p: common_vendor.t($data.isRegister ? "Already have an account? Click to log in" : "No account? Click to register"),
    q: common_vendor.o((...args) => $options.toggleMode && $options.toggleMode(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
