"use strict";
const common_vendor = require("../../common/vendor.js");
const mixins_theme = require("../../mixins/theme.js");
const _sfc_main = {
  mixins: [mixins_theme.themeMixin],
  data() {
    const now = /* @__PURE__ */ new Date();
    const todayStr = now.toISOString().split("T")[0];
    return {
      hotelList: [],
      filteredHotelList: [],
      searchKeyword: "",
      sortOptions: ["Default", "Price: Low to High", "Price: High to Low", "Star: High to Low", "Star: Low to High"],
      sortDisplayOptions: ["Default", "Price ↑", "Price ↓", "Star ↓", "Star ↑"],
      locationOptions: [
        { label: "All Regions", value: "" },
        { label: "Center Financial Place", value: "Beijing CBD" },
        { label: "Fashionable Streets", value: "Sanlitun" },
        { label: "Beautiful Old Town", value: "Gubei Water Town" },
        { label: "Science Park", value: "Wangjing Science and Technology Park" },
        { label: "Old Town", value: "Houhai Old Town" }
      ],
      sortIndex: 0,
      locationIndex: 0,
      selectedLocationValue: "",
      isRoomPickerShow: false,
      personCount: 1,
      roomInfoText: "",
      today: todayStr,
      startDate: todayStr,
      endDate: ""
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
        this.fetchHotelData();
      }
    },
    fetchHotelData() {
      let apiUrl = "http://localhost:8089/api/hotels";
      let requestData = {
        startDate: this.startDate,
        endDate: this.endDate
      };
      if (this.searchKeyword) {
        apiUrl = "http://localhost:8089/api/hotels/ai-search";
        requestData.query = this.searchKeyword;
      }
      common_vendor.index.request({
        url: apiUrl,
        method: "GET",
        data: requestData,
        success: (res) => {
          if (res.statusCode === 200 && Array.isArray(res.data)) {
            this.hotelList = res.data;
            this.applyFilters();
          } else {
            this.hotelList = [];
            this.applyFilters();
          }
        }
      });
    },
    handleAiSearch() {
      this.fetchHotelData();
    },
    onStartDateChange(e) {
      this.startDate = e.detail.value;
      if (this.endDate && this.startDate >= this.endDate) {
        this.endDate = "";
      }
      this.fetchHotelData();
    },
    onEndDateChange(e) {
      this.endDate = e.detail.value;
      this.fetchHotelData();
    },
    applyFilters() {
      let list = Array.isArray(this.hotelList) ? [...this.hotelList] : [];
      if (this.selectedLocationValue) {
        list = list.filter((h) => h.address && h.address.includes(this.selectedLocationValue));
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
      if (!priceStr || priceStr === "N/A")
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
      this.selectedLocationValue = this.locationOptions[this.locationIndex].value;
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
      this.selectedLocationValue = this.locationOptions[1].value;
      this.applyFilters();
      common_vendor.index.showToast({ title: `Located: ${this.locationOptions[1].label}`, icon: "none" });
    },
    goToDetail(hotelId) {
      common_vendor.index.navigateTo({ url: `/pages/detail/detail?id=${hotelId}&startDate=${this.startDate}&endDate=${this.endDate}` });
    },
    getHotelImages(hotel) {
      const name = hotel.name || "";
      if (name.includes("InterContinental"))
        return ["/static/1.jpg", "/static/1-1.jpg", "/static/1-2.jpg"];
      if (name.includes("Sunny Garden"))
        return ["/static/2.jpg", "/static/2-1.jpg", "/static/2-2.jpg"];
      if (name.includes("Neon Velvet"))
        return ["/static/3.jpg", "/static/3-1.jpg", "/static/3-2.jpg"];
      if (name.includes("Heritage"))
        return ["/static/4.jpg", "/static/4-1.jpg", "/static/4-2.jpg"];
      if (name.includes("Smart Stay"))
        return ["/static/5.jpg", "/static/5-1.jpg", "/static/5-2.jpg"];
      return ["/static/logo.png"];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleAiSearch && $options.handleAiSearch(...args), "71"),
    b: $data.searchKeyword,
    c: common_vendor.o(($event) => $data.searchKeyword = $event.detail.value, "0e"),
    d: common_vendor.o((...args) => $options.handleAiSearch && $options.handleAiSearch(...args), "f7"),
    e: common_vendor.t($data.sortDisplayOptions[$data.sortIndex]),
    f: common_vendor.o((...args) => $options.onSortChange && $options.onSortChange(...args), "5a"),
    g: $data.sortIndex,
    h: $data.sortOptions,
    i: common_vendor.t($data.startDate || "Check-in"),
    j: $data.startDate,
    k: $data.today,
    l: common_vendor.o((...args) => $options.onStartDateChange && $options.onStartDateChange(...args), "d7"),
    m: common_vendor.t($data.endDate || "Check-out"),
    n: $data.endDate,
    o: $data.startDate || $data.today,
    p: common_vendor.o((...args) => $options.onEndDateChange && $options.onEndDateChange(...args), "42"),
    q: common_vendor.t($data.locationOptions[$data.locationIndex].label),
    r: common_vendor.o((...args) => $options.onLocationChange && $options.onLocationChange(...args), "c3"),
    s: $data.locationIndex,
    t: $data.locationOptions,
    v: common_vendor.o((...args) => $options.handleGetLocation && $options.handleGetLocation(...args), "ee"),
    w: common_vendor.t($data.roomInfoText || "Guests"),
    x: common_vendor.o((...args) => $options.showRoomPicker && $options.showRoomPicker(...args), "ea"),
    y: common_vendor.f($data.filteredHotelList, (hotel, k0, i0) => {
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
    z: $data.isRoomPickerShow
  }, $data.isRoomPickerShow ? {
    A: $data.personCount,
    B: common_vendor.o(($event) => $data.personCount = $event.detail.value, "8a"),
    C: common_vendor.o((...args) => $options.confirmRoomInfo && $options.confirmRoomInfo(...args), "23"),
    D: common_vendor.o(() => {
    }, "9d"),
    E: common_vendor.o(($event) => $data.isRoomPickerShow = false, "70")
  } : {}, {
    F: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
