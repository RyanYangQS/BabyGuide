"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "CustomTabbar",
  setup(__props) {
    const currentIndex = common_vendor.ref(0);
    const tabList = [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        icon: "🏠"
      },
      {
        pagePath: "/pages/temperature/index",
        text: "体温",
        icon: "🌡️"
      },
      {
        pagePath: "/pages/medicine/index",
        text: "用药",
        icon: "💊"
      },
      {
        pagePath: "/pages/profile/index",
        text: "我的",
        icon: "👤"
      }
    ];
    function switchTab(index) {
      currentIndex.value = index;
      common_vendor.index.switchTab({
        url: tabList[index].pagePath
      });
    }
    common_vendor.onMounted(() => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const route = "/" + currentPage.route;
      const index = tabList.findIndex((item) => item.pagePath === route);
      if (index !== -1) {
        currentIndex.value = index;
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabList, (item, index, i0) => {
          return {
            a: common_vendor.t(item.icon),
            b: common_vendor.t(item.text),
            c: index,
            d: currentIndex.value === index ? 1 : "",
            e: common_vendor.o(($event) => switchTab(index), index)
          };
        })
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-686b695e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/components/CustomTabbar.js.map
