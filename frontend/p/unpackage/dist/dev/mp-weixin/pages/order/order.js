"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      currentTab: "PAID",
      allOrders: []
    };
  },
  computed: {
    filteredOrders() {
      return this.allOrders.filter((order) => order.status === this.currentTab);
    }
  },
  onShow() {
    this.fetchOrders();
  },
  methods: {
    switchTab(tab) {
      this.currentTab = tab;
    },
    fetchOrders() {
      common_vendor.index.request({
        url: "http://localhost:8089/api/orders/user/1",
        method: "GET",
        success: (res) => {
          this.allOrders = res.data;
        }
      });
    },
    // 新增：时间格式化函数，将后端返回的 ISO 字符串转为 YYYY-MM-DD HH:mm 格式
    formatDate(dateString) {
      if (!dateString)
        return "N/A";
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    },
    handleComplete(orderId) {
      common_vendor.index.showModal({
        title: "Complete Order",
        content: "Mark this order as completed?",
        confirmText: "Yes",
        cancelText: "No",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "Processing..." });
            common_vendor.index.request({
              url: `http://localhost:8089/api/orders/${orderId}/complete`,
              method: "POST",
              success: (completeRes) => {
                common_vendor.index.hideLoading();
                if (completeRes.statusCode === 200) {
                  common_vendor.index.showToast({ title: "Completed", icon: "success" });
                  this.fetchOrders();
                } else {
                  common_vendor.index.showToast({ title: "Error", icon: "none" });
                }
              }
            });
          }
        }
      });
    },
    handleCancel(orderId) {
      common_vendor.index.showModal({
        title: "Cancel Booking",
        content: "Are you sure you want to cancel this booking?",
        confirmText: "Yes",
        cancelText: "No",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showLoading({ title: "Cancelling..." });
            common_vendor.index.request({
              url: `http://localhost:8089/api/orders/${orderId}/cancel`,
              method: "POST",
              success: (cancelRes) => {
                common_vendor.index.hideLoading();
                if (cancelRes.statusCode === 200) {
                  common_vendor.index.showToast({ title: "Cancelled", icon: "success" });
                  this.fetchOrders();
                } else {
                  common_vendor.index.showToast({ title: "Error", icon: "none" });
                }
              }
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.currentTab === "PAID" ? 1 : "",
    b: common_vendor.o(($event) => $options.switchTab("PAID")),
    c: $data.currentTab === "COMPLETED" ? 1 : "",
    d: common_vendor.o(($event) => $options.switchTab("COMPLETED")),
    e: $options.filteredOrders.length > 0
  }, $options.filteredOrders.length > 0 ? {
    f: common_vendor.f($options.filteredOrders, (order, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.id),
        b: common_vendor.t(order.status),
        c: common_vendor.n(order.status.toLowerCase()),
        d: common_vendor.t(order.hotelName || "N/A"),
        e: common_vendor.t(order.roomType || "N/A"),
        f: common_vendor.t(order.status === "PAID" ? "Paid Time:" : "Completed Time:"),
        g: common_vendor.t(order.status === "PAID" ? $options.formatDate(order.createTime) : $options.formatDate(order.completeTime)),
        h: common_vendor.t(order.totalPrice),
        i: order.status === "PAID"
      }, order.status === "PAID" ? {
        j: common_vendor.o(($event) => $options.handleComplete(order.id), order.id),
        k: common_vendor.o(($event) => $options.handleCancel(order.id), order.id)
      } : {}, {
        l: order.id
      });
    })
  } : {
    g: common_vendor.t($data.currentTab.toLowerCase())
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
