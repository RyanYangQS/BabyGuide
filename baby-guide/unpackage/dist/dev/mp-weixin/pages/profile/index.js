"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_children = require("../../src/store/modules/children.js");
const src_utils_date = require("../../src/utils/date.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const childrenStore = src_store_modules_children.useChildrenStore();
    const userInfo = common_vendor.ref({
      name: "",
      phone: ""
    });
    const childrenList = common_vendor.ref([]);
    function handleLogin() {
      common_vendor.index.showToast({ title: "登录功能开发中", icon: "none" });
    }
    function handleAddChild() {
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
    common_vendor.onMounted(() => {
      if (childrenList.value.length === 0) {
        const mockChildren = [
          {
            _id: "1",
            name: "小明",
            avatar: "",
            gender: "male",
            birthday: "2022-06-15",
            createTime: (/* @__PURE__ */ new Date()).toISOString(),
            updateTime: (/* @__PURE__ */ new Date()).toISOString()
          },
          {
            _id: "2",
            name: "小红",
            avatar: "",
            gender: "female",
            birthday: "2023-03-20",
            createTime: (/* @__PURE__ */ new Date()).toISOString(),
            updateTime: (/* @__PURE__ */ new Date()).toISOString()
          }
        ];
        childrenList.value = mockChildren;
        childrenStore.setChildrenList(mockChildren);
        if (!childrenStore.currentChild) {
          childrenStore.setCurrentChild(mockChildren[0]);
        }
      }
    });
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_vendor.t(((_a = userInfo.value.name) == null ? void 0 : _a.charAt(0)) || "用"),
        b: common_vendor.t(userInfo.value.name || "点击登录"),
        c: common_vendor.t(userInfo.value.phone || "登录后查看更多信息"),
        d: common_vendor.o(handleLogin),
        e: common_vendor.o(handleAddChild),
        f: childrenList.value.length > 0
      }, childrenList.value.length > 0 ? {
        g: common_vendor.f(childrenList.value, (child, k0, i0) => {
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
        h: common_vendor.o(handleAddChild)
      }, {
        i: common_vendor.o(($event) => handleMenuClick("family")),
        j: common_vendor.o(($event) => handleMenuClick("reminder")),
        k: common_vendor.o(($event) => handleMenuClick("export")),
        l: common_vendor.o(($event) => handleMenuClick("feedback")),
        m: common_vendor.o(($event) => handleMenuClick("about"))
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-201c0da5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/index.js.map
