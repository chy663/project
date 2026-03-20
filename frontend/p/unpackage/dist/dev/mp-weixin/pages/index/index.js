"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
  data() {
    return {
      hotelList: [],
      filteredHotelList: [],
      searchKeyword: "",
      sortOptions: ["Default", "Price: Low to High", "Price: High to Low", "Star: High to Low", "Star: Low to High"],
      sortDisplayOptions: ["Default", "Price ↑", "Price ↓", "Star ↓", "Star ↑"],
      locationOptions: ["All Regions", "Street 1", "Street 2", "Street 3", "Street 4", "Street 5"],
      sortIndex: 0,
      locationIndex: 0,
      selectedLocation: "",
      isRoomPickerShow: false,
      personCount: 1,
      roomInfoText: ""
    };
  },
  onShow() {
    this.checkLoginState();
  },
  methods: {
    checkLoginState() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo || !userInfo.username) {
        common_vendor.index.reLaunch({ url: "/pages/login/login" });
      } else {
        if (this.hotelList.length === 0) {
          this.fetchHotelData();
        }
      }
    },
    // 1. 获取初始数据：改用 AI 搜索接口并传空，确保后端返回全部
    fetchHotelData() {
      common_vendor.index.request({
        url: "http://localhost:8089/api/hotels/ai-search",
        method: "GET",
        data: { query: "" },
        success: (res) => {
          if (res.statusCode === 200 && Array.isArray(res.data)) {
            this.hotelList = res.data;
            this.applyFilters();
          } else {
            common_vendor.index.__f__("error", "at pages/index/index.vue:142", "Fetch Data Failed:", res.data);
            this.hotelList = [];
            this.applyFilters();
          }
        }
      });
    },
    // 2. AI 搜索：搜索结果存入 hotelList 并触发统一过滤
    handleAiSearch() {
      const query = this.searchKeyword.trim();
      if (!query) {
        this.fetchHotelData();
        return;
      }
      common_vendor.index.showLoading({ title: "AI Searching..." });
      common_vendor.index.request({
        url: "http://localhost:8089/api/hotels/ai-search",
        method: "GET",
        data: { query },
        success: (res) => {
          if (res.statusCode === 200 && Array.isArray(res.data)) {
            this.hotelList = res.data;
            this.applyFilters();
            if (this.hotelList.length === 0) {
              common_vendor.index.showToast({ title: "Not Found", icon: "none" });
            }
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/index/index.vue:171", "搜索失败:", err);
          common_vendor.index.showToast({ title: "网络异常", icon: "none" });
        },
        complete: () => {
          common_vendor.index.hideLoading();
        }
      });
    },
    // 3. 核心过滤器：增加了对 hotelList 的类型保护
    applyFilters() {
      let list = Array.isArray(this.hotelList) ? [...this.hotelList] : [];
      if (this.selectedLocation && this.selectedLocation !== "All Regions") {
        list = list.filter((h) => h.address && h.address.includes(this.selectedLocation));
      }
      if (this.personCount > 0) {
        list = list.filter((h) => (h.maxCapacity || 0) >= this.personCount);
      }
      this.filteredHotelList = this.applySort(list);
    },
    applySort(list) {
      const index = this.sortIndex;
      let sortedList = [...list];
      if (index === 0)
        sortedList.sort((a, b) => a.id - b.id);
      else if (index === 1)
        sortedList.sort((a, b) => this.getMinPrice(a.price) - this.getMinPrice(b.price));
      else if (index === 2)
        sortedList.sort((a, b) => this.getMinPrice(b.price) - this.getMinPrice(a.price));
      else if (index === 3)
        sortedList.sort((a, b) => b.starRating - a.starRating);
      else if (index === 4)
        sortedList.sort((a, b) => a.starRating - b.starRating);
      return sortedList;
    },
    getMinPrice(priceStr) {
      if (typeof priceStr === "number")
        return priceStr;
      if (!priceStr)
        return 0;
      const match = String(priceStr).match(/\d+/);
      return match ? parseFloat(match[0]) : 0;
    },
    onSortChange(e) {
      this.sortIndex = parseInt(e.detail.value);
      this.applyFilters();
    },
    onLocationChange(e) {
      this.locationIndex = parseInt(e.detail.value);
      this.selectedLocation = this.locationIndex > 0 ? this.locationOptions[this.locationIndex] : "";
      this.applyFilters();
    },
    showRoomPicker() {
      this.isRoomPickerShow = true;
    },
    confirmRoomInfo() {
      this.roomInfoText = `${this.personCount} Guests`;
      this.isRoomPickerShow = false;
      this.applyFilters();
    },
    handleGetLocation() {
      this.locationIndex = 1;
      this.selectedLocation = "Street 1";
      this.applyFilters();
      common_vendor.index.showToast({ title: "Located: Street 1", icon: "none" });
    },
    goToDetail(hotelId) {
      common_vendor.index.navigateTo({ url: `/pages/detail/detail?id=${hotelId}` });
    },
    getHotelImages(hotel) {
      const name = hotel.name || "";
      if (name.includes("Hotel A"))
        return ["/static/1.jpg", "/static/1-1.jpg", "/static/1-2.jpg"];
      if (name.includes("Hotel B"))
        return ["/static/2.jpg", "/static/2-1.jpg", "/static/2-2.jpg"];
      if (name.includes("Hotel C"))
        return ["/static/3.jpg", "/static/3-1.jpg", "/static/3-2.jpg"];
      if (name.includes("Hotel D"))
        return ["/static/4.jpg", "/static/4-1.jpg", "/static/4-2.jpg"];
      if (name.includes("Hotel E"))
        return ["/static/5.jpg", "/static/5-1.jpg", "/static/5-2.jpg"];
      return ["/static/logo.png"];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleAiSearch && $options.handleAiSearch(...args)),
    b: $data.searchKeyword,
    c: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value),
    d: common_vendor.o((...args) => $options.handleAiSearch && $options.handleAiSearch(...args)),
    e: common_vendor.t($data.sortDisplayOptions[$data.sortIndex]),
    f: common_vendor.o((...args) => $options.onSortChange && $options.onSortChange(...args)),
    g: $data.sortIndex,
    h: $data.sortOptions,
    i: common_vendor.t($data.locationOptions[$data.locationIndex]),
    j: common_vendor.o((...args) => $options.onLocationChange && $options.onLocationChange(...args)),
    k: $data.locationIndex,
    l: $data.locationOptions,
    m: common_vendor.o((...args) => $options.handleGetLocation && $options.handleGetLocation(...args)),
    n: common_vendor.t($data.roomInfoText || "Guests"),
    o: common_vendor.o((...args) => $options.showRoomPicker && $options.showRoomPicker(...args)),
    p: common_vendor.f($data.filteredHotelList, (hotel, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.f($options.getHotelImages(hotel), (img, index, i1) => {
          return {
            a: img,
            b: index
          };
        }),
        b: common_vendor.o(() => {
        }, hotel.id),
        c: common_vendor.t(hotel.name),
        d: hotel.capacity
      }, hotel.capacity ? {
        e: common_vendor.t(hotel.capacity)
      } : {}, {
        f: common_vendor.t(hotel.address),
        g: common_vendor.t(hotel.price),
        h: common_vendor.t(hotel.starRating),
        i: hotel.id,
        j: common_vendor.o(($event) => $options.goToDetail(hotel.id), hotel.id)
      });
    }),
    q: $data.isRoomPickerShow
  }, $data.isRoomPickerShow ? {
    r: $data.personCount,
    s: common_vendor.o(($event) => $data.personCount = $event.detail.value),
    t: common_vendor.o((...args) => $options.confirmRoomInfo && $options.confirmRoomInfo(...args)),
    v: common_vendor.o(() => {
    }),
    w: common_vendor.o(($event) => $data.isRoomPickerShow = false)
  } : {}, {
    x: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
