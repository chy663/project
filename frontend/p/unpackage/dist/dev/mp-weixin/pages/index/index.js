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
        common_vendor.index.reLaunch({
          url: "/pages/login/login"
        });
      } else {
        if (this.hotelList.length === 0) {
          this.fetchHotelData();
        }
      }
    },
    goToDetail(hotelId) {
      common_vendor.index.navigateTo({ url: `/pages/detail/detail?id=${hotelId}` });
    },
    getMinPrice(priceStr) {
      if (!priceStr)
        return 0;
      const match = priceStr.match(/\d+/);
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
    applySort(list) {
      const index = this.sortIndex;
      if (index === 0)
        list.sort((a, b) => a.id - b.id);
      else if (index === 1)
        list.sort((a, b) => this.getMinPrice(a.price) - this.getMinPrice(b.price));
      else if (index === 2)
        list.sort((a, b) => this.getMinPrice(b.price) - this.getMinPrice(a.price));
      else if (index === 3)
        list.sort((a, b) => b.starRating - a.starRating);
      else if (index === 4)
        list.sort((a, b) => a.starRating - b.starRating);
      return list;
    },
    showRoomPicker() {
      this.isRoomPickerShow = true;
    },
    confirmRoomInfo() {
      this.roomInfoText = `${this.personCount} Guests`;
      this.isRoomPickerShow = false;
      this.applyFilters();
    },
    applyFilters() {
      let list = [...this.hotelList];
      if (this.searchKeyword) {
        const kw = this.searchKeyword.toLowerCase();
        list = list.filter((h) => h.name.toLowerCase().includes(kw) || h.address.toLowerCase().includes(kw));
      }
      if (this.selectedLocation && this.selectedLocation !== "All Regions") {
        list = list.filter((h) => h.address.includes(this.selectedLocation));
      }
      if (this.personCount > 0) {
        list = list.filter((h) => (h.maxCapacity || 0) >= this.personCount);
      }
      this.filteredHotelList = this.applySort(list);
    },
    fetchHotelData() {
      common_vendor.index.request({
        url: "http://localhost:8089/api/hotels",
        method: "GET",
        success: (res) => {
          this.hotelList = res.data;
          this.applyFilters();
        }
      });
    },
    onSearch() {
      this.applyFilters();
    },
    handleGetLocation() {
      this.locationIndex = 1;
      this.selectedLocation = "Street 1";
      this.applyFilters();
      common_vendor.index.showToast({ title: "Located: Street 1", icon: "none" });
    },
    getHotelImages(hotel) {
      var _a, _b, _c, _d, _e;
      if ((_a = hotel.name) == null ? void 0 : _a.includes("Hotel A")) {
        return ["/static/1.jpg", "/static/1-1.jpg", "/static/1-2.jpg"];
      } else if ((_b = hotel.name) == null ? void 0 : _b.includes("Hotel B")) {
        return ["/static/2.jpg", "/static/2-1.jpg", "/static/2-2.jpg"];
      } else if ((_c = hotel.name) == null ? void 0 : _c.includes("Hotel C")) {
        return ["/static/3.jpg", "/static/3-1.jpg", "/static/3-2.jpg"];
      } else if ((_d = hotel.name) == null ? void 0 : _d.includes("Hotel D")) {
        return ["/static/4.jpg", "/static/4-1.jpg", "/static/4-2.jpg"];
      } else if ((_e = hotel.name) == null ? void 0 : _e.includes("Hotel E")) {
        return ["/static/5.jpg", "/static/5-1.jpg", "/static/5-2.jpg"];
      }
      return ["/static/logo.png"];
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.onSearch && $options.onSearch(...args)]),
    b: $data.searchKeyword,
    c: common_vendor.t($data.sortDisplayOptions[$data.sortIndex]),
    d: common_vendor.o((...args) => $options.onSortChange && $options.onSortChange(...args)),
    e: $data.sortIndex,
    f: $data.sortOptions,
    g: common_vendor.t($data.locationOptions[$data.locationIndex]),
    h: common_vendor.o((...args) => $options.onLocationChange && $options.onLocationChange(...args)),
    i: $data.locationIndex,
    j: $data.locationOptions,
    k: common_vendor.o((...args) => $options.handleGetLocation && $options.handleGetLocation(...args)),
    l: common_vendor.t($data.roomInfoText || "Guests"),
    m: common_vendor.o((...args) => $options.showRoomPicker && $options.showRoomPicker(...args)),
    n: common_vendor.f($data.filteredHotelList, (hotel, k0, i0) => {
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
    o: $data.isRoomPickerShow
  }, $data.isRoomPickerShow ? {
    p: $data.personCount,
    q: common_vendor.o(($event) => $data.personCount = $event.detail.value),
    r: common_vendor.o((...args) => $options.confirmRoomInfo && $options.confirmRoomInfo(...args)),
    s: common_vendor.o(() => {
    }),
    t: common_vendor.o(($event) => $data.isRoomPickerShow = false)
  } : {}, {
    v: common_vendor.n(_ctx.isDark ? "dark-mode" : "")
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
