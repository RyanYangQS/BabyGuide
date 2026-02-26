"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_children = require("../../src/store/modules/children.js");
const src_store_modules_user = require("../../src/store/modules/user.js");
const src_utils_date = require("../../src/utils/date.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const childrenStore = src_store_modules_children.useChildrenStore();
    const userStore = src_store_modules_user.useUserStore();
    const showLoginModal = common_vendor.ref(false);
    const isLoggedIn = common_vendor.computed(() => userStore.isLoggedIn);
    const userInfo = common_vendor.computed(() => userStore.userInfo);
    const childrenList = common_vendor.computed(() => childrenStore.childrenList);
    function handleLoginClick() {
      showLoginModal.value = true;
    }
    async function onGetUserInfo(e) {
      common_vendor.index.__f__("log", "at pages/profile/index.vue:190", "获取用户信息:", e);
      if (e.detail.errMsg === "getUserInfo:ok") {
        const { nickName, avatarUrl } = e.detail.userInfo;
        common_vendor.index.showLoading({ title: "登录中...", mask: true });
        const loginRes = await userStore.login();
        common_vendor.index.hideLoading();
        if (loginRes.success) {
          userStore.updateUserInfo(nickName, avatarUrl);
          common_vendor.index.showToast({ title: "登录成功", icon: "success" });
          await childrenStore.fetchChildren();
        } else {
          common_vendor.index.showToast({ title: loginRes.errMsg || "登录失败", icon: "none" });
        }
        showLoginModal.value = false;
      } else {
        common_vendor.index.showToast({ title: "需要授权才能登录", icon: "none" });
      }
    }
    function onChooseAvatar(e) {
      common_vendor.index.__f__("log", "at pages/profile/index.vue:221", "选择头像:", e);
      const avatarUrl = e.detail.avatarUrl;
      common_vendor.index.showModal({
        title: "设置昵称",
        editable: true,
        placeholderText: "请输入昵称",
        success: (res) => {
          if (res.confirm && res.content) {
            userStore.updateUserInfo(res.content, avatarUrl);
            common_vendor.index.showToast({ title: "设置成功", icon: "success" });
          }
        }
      });
    }
    function handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            userStore.logout();
            common_vendor.index.showToast({ title: "已退出登录", icon: "success" });
          }
        }
      });
    }
    function handleAddChild() {
      if (!isLoggedIn.value) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/profile/addChild"
      });
    }
    function handleChildClick(child) {
      childrenStore.setCurrentChild(child);
      common_vendor.index.navigateTo({
        url: "/pages/profile/childDetail"
      });
    }
    function handleMenuClick(type) {
      const menuMap = {
        family: "家庭成员管理",
        reminder: "提醒设置",
        export: "数据导出",
        feedback: "意见反馈",
        about: "关于我们"
      };
      common_vendor.index.showToast({ title: `${menuMap[type]}开发中`, icon: "none" });
    }
    common_vendor.onMounted(async () => {
      userStore.checkLoginStatus();
      if (isLoggedIn.value) {
        await childrenStore.fetchChildren();
      }
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e;
      return common_vendor.e({
        a: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        b: common_vendor.o(handleLoginClick)
      } : isLoggedIn.value && !((_a = userInfo.value) == null ? void 0 : _a.nickName) ? {
        d: common_vendor.o(onChooseAvatar)
      } : common_vendor.e({
        e: (_b = userInfo.value) == null ? void 0 : _b.avatarUrl
      }, ((_c = userInfo.value) == null ? void 0 : _c.avatarUrl) ? {
        f: userInfo.value.avatarUrl
      } : {}, {
        g: common_vendor.t(((_d = userInfo.value) == null ? void 0 : _d.nickName) || "微信用户"),
        h: common_vendor.o(handleLogout)
      }), {
        c: isLoggedIn.value && !((_e = userInfo.value) == null ? void 0 : _e.nickName),
        i: isLoggedIn.value
      }, isLoggedIn.value ? {
        j: common_vendor.o(handleAddChild)
      } : {}, {
        k: !isLoggedIn.value
      }, !isLoggedIn.value ? {} : childrenList.value.length > 0 ? {
        m: common_vendor.f(childrenList.value, (child, k0, i0) => {
          return {
            a: common_vendor.t(child.name.charAt(0)),
            b: common_vendor.t(child.name),
            c: common_vendor.t(common_vendor.unref(src_utils_date.formatAge)(child.birthday)),
            d: common_vendor.t(child.gender === "male" ? "男" : "女"),
            e: child._id,
            f: common_vendor.o(($event) => handleChildClick(child), child._id)
          };
        })
      } : {
        n: common_vendor.o(handleAddChild)
      }, {
        l: childrenList.value.length > 0,
        o: common_vendor.o(($event) => handleMenuClick("family")),
        p: common_vendor.o(($event) => handleMenuClick("reminder")),
        q: common_vendor.o(($event) => handleMenuClick("export")),
        r: common_vendor.o(($event) => handleMenuClick("feedback")),
        s: common_vendor.o(($event) => handleMenuClick("about")),
        t: showLoginModal.value
      }, showLoginModal.value ? {
        v: common_vendor.o(($event) => showLoginModal.value = false),
        w: common_vendor.o(onGetUserInfo),
        x: common_vendor.o(($event) => showLoginModal.value = false)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-201c0da5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/index.js.map
