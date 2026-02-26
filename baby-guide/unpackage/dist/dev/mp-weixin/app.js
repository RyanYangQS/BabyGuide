"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const src_store_modules_children = require("./src/store/modules/children.js");
const src_store_modules_user = require("./src/store/modules/user.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/temperature/index.js";
  "./pages/medicine/index.js";
  "./pages/profile/index.js";
  "./pages/profile/childDetail.js";
  "./pages/profile/addChild.js";
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(async () => {
      common_vendor.index.__f__("log", "at App.vue:7", "App Launch");
      if (!common_vendor.index.cloud) {
        common_vendor.index.__f__("error", "at App.vue:11", "当前环境不支持云开发");
        return;
      }
      try {
        common_vendor.index.cloud.init({
          env: "cloud1-4gc1m9gl2ae51c9c",
          traceUser: true
        });
        common_vendor.index.__f__("log", "at App.vue:20", "云开发初始化成功");
      } catch (err) {
        common_vendor.index.__f__("error", "at App.vue:22", "云开发初始化失败:", err);
        return;
      }
      const userStore = src_store_modules_user.useUserStore();
      const wasLoggedIn = userStore.checkLoginStatus();
      if (wasLoggedIn) {
        const childrenStore = src_store_modules_children.useChildrenStore();
        await childrenStore.fetchChildren();
      }
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at App.vue:38", "App Show");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at App.vue:42", "App Hide");
    });
    return () => {
    };
  }
});
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  const pinia = common_vendor.createPinia();
  app.use(pinia);
  app.use(common_vendor.uviewPlus);
  return {
    app,
    pinia
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
