"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
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
      selectedOrder: null,
      isAIGuideModalShow: false,
      aiGuideContent: "",
      isAILoading: false,
      currentAIGuideOrderId: null
    };
  },
  computed: {
    filteredOrderList() {
      return this.orderList.filter((order) => order.status === this.currentTab);
    }
  },
  onShow() {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    if (userInfo && userInfo.id) {
      this.userId = userInfo.id;
    }
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
      return order.createTime ? order.createTime.replace("T", " ").substring(0, 16) : "N/A";
    },
    handleCancel(orderId) {
      common_vendor.index.showModal({
        title: "Cancel Order",
        content: "Are you sure you want to cancel?",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.request({
              url: `http://localhost:8089/api/orders/${orderId}/cancel`,
              method: "POST",
              success: () => {
                common_vendor.index.showToast({ title: "Cancelled" });
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
    },
    openAIGuideModal(orderId) {
      this.currentAIGuideOrderId = orderId;
      this.aiGuideContent = "";
      this.isAILoading = false;
      this.isAIGuideModalShow = true;
    },
    generateAIGuide() {
      if (!this.currentAIGuideOrderId || this.isAILoading)
        return;
      this.isAILoading = true;
      common_vendor.index.request({
        url: `http://localhost:8089/api/orders/${this.currentAIGuideOrderId}/ai-guide`,
        method: "GET",
        success: (res) => {
          this.isAILoading = false;
          if (res.statusCode === 200) {
            this.aiGuideContent = res.data;
          } else {
            this.aiGuideContent = "Failed to generate guide.";
          }
        },
        fail: () => {
          this.isAILoading = false;
          this.aiGuideContent = "Network error.";
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
        a: common_vendor.t(order.hotelName || "Unknown Hotel"),
        b: common_vendor.t(order.status),
        c: common_vendor.n($options.getStatusClass(order.status)),
        d: common_vendor.t(order.roomType || "Standard Room"),
        e: common_vendor.t(order.totalPrice),
        f: common_vendor.t(order.guestName || "N/A"),
        g: common_vendor.t(order.checkInDate),
        h: common_vendor.t(order.checkOutDate),
        i: common_vendor.t(order.guestPhone || "N/A"),
        j: common_vendor.t($options.formatTime(order)),
        k: order.status === "PAID"
      }, order.status === "PAID" ? {
        l: common_vendor.o(($event) => $options.handleCancel(order.id), index),
        m: common_vendor.o(($event) => $options.handleComplete(order.id), index)
      } : {}, {
        n: order.status === "COMPLETED"
      }, order.status === "COMPLETED" ? {
        o: common_vendor.o(($event) => $options.openAIGuideModal(order.id), index),
        p: common_vendor.o(($event) => $options.openReviewModal(order), index)
      } : {}, {
        q: index
      });
    })
  } : {
    e: common_vendor.t($data.currentTab.toLowerCase())
  }, {
    f: $data.isReviewModalShow
  }, $data.isReviewModalShow ? {
    g: $data.reviewContent,
    h: common_vendor.o(($event) => $data.reviewContent = $event.detail.value, "93"),
    i: common_vendor.o(($event) => $data.isReviewModalShow = false, "1f"),
    j: common_vendor.o((...args) => $options.submitReview && $options.submitReview(...args), "9b"),
    k: common_vendor.o(() => {
    }, "43"),
    l: common_vendor.o(($event) => $data.isReviewModalShow = false, "f2")
  } : {}, {
    m: $data.isAIGuideModalShow
  }, $data.isAIGuideModalShow ? common_vendor.e({
    n: $data.isAILoading || $data.aiGuideContent
  }, $data.isAILoading || $data.aiGuideContent ? common_vendor.e({
    o: $data.isAILoading
  }, $data.isAILoading ? {} : {
    p: common_vendor.t($data.aiGuideContent)
  }) : {}, {
    q: !$data.aiGuideContent
  }, !$data.aiGuideContent ? {
    r: common_vendor.o((...args) => $options.generateAIGuide && $options.generateAIGuide(...args), "33"),
    s: $data.isAILoading,
    t: common_vendor.o(($event) => $data.isAIGuideModalShow = false, "1c")
  } : {
    v: common_vendor.o(($event) => $data.isAIGuideModalShow = false, "a1")
  }, {
    w: common_vendor.o(() => {
    }, "37"),
    x: common_vendor.o(($event) => $data.isAIGuideModalShow = false, "25")
  }) : {}, {
    y: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
