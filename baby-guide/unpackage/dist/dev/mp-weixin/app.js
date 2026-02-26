"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const src_api_index = require("./src/api/index.js");
const src_store_modules_children = require("./src/store/modules/children.js");
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
      var _a;
      common_vendor.index.__f__("log", "at App.vue:7", "App Launch");
      if (!common_vendor.index.cloud) {
        common_vendor.index.__f__("error", "at App.vue:11", "当前环境不支持云开发，请使用真机预览");
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
      try {
        const res = await src_api_index.userLogin();
        if (res.success) {
          common_vendor.index.__f__("log", "at App.vue:30", "用户登录成功", ((_a = res.data) == null ? void 0 : _a.isNewUser) ? "(新用户)" : "(老用户)");
          const childrenStore = src_store_modules_children.useChildrenStore();
          await childrenStore.fetchChildren();
        } else {
          common_vendor.index.__f__("error", "at App.vue:36", "登录失败:", res.errMsg);
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at App.vue:39", "登录异常:", err);
      }
    });
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at App.vue:44", "App Show");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at App.vue:48", "App Hide");
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
