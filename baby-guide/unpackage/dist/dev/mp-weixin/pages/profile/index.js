"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_children = require("../../src/store/modules/children.js");
const src_utils_date = require("../../src/utils/date.js");
const defaultAvatar = "/static/logo.png";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const childrenStore = src_store_modules_children.useChildrenStore();
    const userInfo = common_vendor.ref({
      name: "用户昵称",
      avatar: "",
      phone: ""
    });
    const childrenList = common_vendor.ref([]);
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
      switch (type) {
        case "family":
          common_vendor.index.showToast({ title: "家庭成员管理", icon: "none" });
          break;
        case "reminder":
          common_vendor.index.showToast({ title: "提醒设置", icon: "none" });
          break;
        case "export":
          common_vendor.index.showToast({ title: "数据导出", icon: "none" });
          break;
        case "feedback":
          common_vendor.index.showToast({ title: "意见反馈", icon: "none" });
          break;
        case "about":
          common_vendor.index.showToast({ title: "关于我们", icon: "none" });
          break;
      }
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
      return common_vendor.e({
        a: userInfo.value.avatar || defaultAvatar,
        b: common_vendor.t(userInfo.value.name || "未登录"),
        c: common_vendor.t(userInfo.value.phone || "点击登录"),
        d: common_vendor.o(handleAddChild),
        e: childrenList.value.length > 0
      }, childrenList.value.length > 0 ? {
        f: common_vendor.f(childrenList.value, (child, k0, i0) => {
          return {
            a: child.avatar || defaultAvatar,
            b: common_vendor.t(child.name),
            c: common_vendor.t(common_vendor.unref(src_utils_date.formatAge)(child.birthday)),
            d: common_vendor.t(child.gender === "male" ? "男" : "女"),
            e: child._id,
            f: common_vendor.o(($event) => handleChildClick(child), child._id)
          };
        })
      } : {
        g: common_vendor.o(handleAddChild)
      }, {
        h: common_vendor.o(($event) => handleMenuClick("family")),
        i: common_vendor.o(($event) => handleMenuClick("reminder")),
        j: common_vendor.o(($event) => handleMenuClick("export")),
        k: common_vendor.o(($event) => handleMenuClick("feedback")),
        l: common_vendor.o(($event) => handleMenuClick("about"))
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-201c0da5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/index.js.map
