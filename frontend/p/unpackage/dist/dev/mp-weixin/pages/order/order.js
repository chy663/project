"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      userId: 1,
      orderList: [],
      currentTab: "PAID",
      tabs: [
        { name: "Paid", value: "PAID" },
        { name: "Completed", value: "COMPLETED" },
        { name: "Cancelled", value: "CANCELLED" }
      ],
      isReviewModalShow: false,
      reviewContent: "",
      selectedOrder: null
    };
  },
  computed: {
    filteredOrderList() {
      return this.orderList.filter((order) => order.status === this.currentTab);
    }
  },
  onShow() {
    this.fetchOrders();
  },
  methods: {
    fetchOrders() {
      common_vendor.index.request({
        url: `http://localhost:8089/api/orders/user/${this.userId}`,
        method: "GET",
        success: (res) => {
          this.orderList = res.data.reverse();
        }
      });
    },
    switchTab(value) {
      this.currentTab = value;
    },
    getStatusClass(status) {
      if (status === "PAID")
        return "tag-paid";
      if (status === "COMPLETED")
        return "tag-completed";
      return "tag-cancelled";
    },
    formatTime(order) {
      return order.createTime ? order.createTime.replace("T", " ").substring(0, 16) : "2026-03-11 14:00";
    },
    handleCancel(orderId) {
      common_vendor.index.showModal({
        title: "Cancel Order",
        content: "Are you sure?",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: `http://localhost:8089/api/orders/${orderId}/cancel`,
              method: "POST",
              success: () => {
                this.fetchOrders();
              }
            });
          }
        }
      });
    },
    handleComplete(orderId) {
      common_vendor.index.request({
        url: `http://localhost:8089/api/orders/${orderId}/complete`,
        method: "POST",
        success: () => {
          common_vendor.index.showToast({ title: "Checked In" });
          this.fetchOrders();
        }
      });
    },
    openReviewModal(order) {
      this.selectedOrder = order;
      this.reviewContent = "";
      this.isReviewModalShow = true;
    },
    submitReview() {
      if (!this.reviewContent.trim()) {
        common_vendor.index.showToast({ title: "Please enter review", icon: "none" });
        return;
      }
      common_vendor.index.request({
        url: "http://localhost:8089/api/reviews/add",
        method: "POST",
        data: {
          userId: this.userId,
          roomId: this.selectedOrder.roomId,
          content: this.reviewContent
        },
        success: () => {
          common_vendor.index.showToast({ title: "Success" });
          this.isReviewModalShow = false;
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.tabs, (tab, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(tab.name),
        b: $data.currentTab === tab.value
      }, $data.currentTab === tab.value ? {} : {}, {
        c: index,
        d: $data.currentTab === tab.value ? 1 : "",
        e: common_vendor.o(($event) => $options.switchTab(tab.value), index)
      });
    }),
    b: common_vendor.n("active-" + $data.currentTab.toLowerCase()),
    c: $options.filteredOrderList.length > 0
  }, $options.filteredOrderList.length > 0 ? {
    d: common_vendor.f($options.filteredOrderList, (order, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(order.hotelName),
        b: common_vendor.t(order.status),
        c: common_vendor.n($options.getStatusClass(order.status)),
        d: common_vendor.t(order.roomType),
        e: common_vendor.t(order.totalPrice),
        f: common_vendor.t(order.guestName || "N/A"),
        g: common_vendor.t(order.guestPhone || "N/A"),
        h: common_vendor.t($options.formatTime(order)),
        i: order.status === "PAID"
      }, order.status === "PAID" ? {
        j: common_vendor.o(($event) => $options.handleCancel(order.id), index),
        k: common_vendor.o(($event) => $options.handleComplete(order.id), index)
      } : {}, {
        l: order.status === "COMPLETED"
      }, order.status === "COMPLETED" ? {
        m: common_vendor.o(($event) => $options.openReviewModal(order), index)
      } : {}, {
        n: index
      });
    })
  } : {
    e: common_assets._imports_0,
    f: common_vendor.t($data.currentTab.toLowerCase())
  }, {
    g: $data.isReviewModalShow
  }, $data.isReviewModalShow ? {
    h: $data.reviewContent,
    i: common_vendor.o(($event) => $data.reviewContent = $event.detail.value),
    j: common_vendor.o(($event) => $data.isReviewModalShow = false),
    k: common_vendor.o((...args) => $options.submitReview && $options.submitReview(...args)),
    l: common_vendor.o(() => {
    }),
    m: common_vendor.o(($event) => $data.isReviewModalShow = false)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
