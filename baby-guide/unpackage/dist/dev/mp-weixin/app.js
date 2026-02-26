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
      common_vendor.index.__f__("log", "at App.vue:7", "App Launch");
      if (!common_vendor.index.cloud) {
        common_vendor.index.__f__("error", "at App.vue:11", "当前环境不支持云开发");
        common_vendor.index.showModal({
          title: "提示",
          content: "当前环境不支持云开发，请使用微信真机预览",
          showCancel: false
        });
        return;
      }
      try {
        common_vendor.index.cloud.init({
          env: "cloud1-4gc1m9gl2ae51c9c",
          traceUser: true
        });
        common_vendor.index.__f__("log", "at App.vue:25", "云开发初始化成功");
      } catch (err) {
        common_vendor.index.__f__("error", "at App.vue:27", "云开发初始化失败:", err);
        common_vendor.index.showToast({
          title: "云开发初始化失败",
          icon: "none"
        });
        return;
      }
      await doLogin();
    });
    async function doLogin() {
      var _a, _b;
      try {
        common_vendor.index.showLoading({ title: "登录中...", mask: true });
        const res = await src_api_index.userLogin();
        common_vendor.index.hideLoading();
        if (res.success) {
          common_vendor.index.__f__("log", "at App.vue:48", "用户登录成功", ((_a = res.data) == null ? void 0 : _a.isNewUser) ? "(新用户)" : "(老用户)");
          const childrenStore = src_store_modules_children.useChildrenStore();
          await childrenStore.fetchChildren();
          if ((_b = res.data) == null ? void 0 : _b.isNewUser) {
            common_vendor.index.__f__("log", "at App.vue:55", "新用户，欢迎！");
          }
        } else {
          common_vendor.index.__f__("error", "at App.vue:58", "登录失败:", res.errMsg);
          common_vendor.index.showModal({
            title: "登录失败",
            content: res.errMsg || "请检查网络后重试",
            showCancel: false
          });
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at App.vue:67", "登录异常:", err);
        common_vendor.index.showModal({
          title: "登录异常",
          content: err.message || "网络错误，请重试",
          showCancel: false
        });
      }
    }
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at App.vue:77", "App Show");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at App.vue:81", "App Hide");
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
