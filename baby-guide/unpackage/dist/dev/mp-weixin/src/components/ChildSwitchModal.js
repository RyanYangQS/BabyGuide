"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_children = require("../store/modules/children.js");
const src_utils_date = require("../utils/date.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "ChildSwitchModal",
  props: {
    show: { type: Boolean }
  },
  emits: ["update:show", "change"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const childrenStore = src_store_modules_children.useChildrenStore();
    const childrenList = common_vendor.computed(() => childrenStore.childrenList);
    const currentChildId = common_vendor.computed(() => {
      var _a;
      return (_a = childrenStore.currentChild) == null ? void 0 : _a._id;
    });
    function handleClose() {
      emit("update:show", false);
    }
    function handleSelectChild(child) {
      childrenStore.setCurrentChild(child);
      emit("change", child);
      handleClose();
    }
    function handleAddChild() {
      handleClose();
      common_vendor.index.navigateTo({ url: "/pages/profile/addChild" });
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.show
      }, _ctx.show ? {
        b: common_vendor.o(handleClose),
        c: common_vendor.f(childrenList.value, (child, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(child.name.charAt(0)),
            b: common_vendor.t(child.name),
            c: common_vendor.t(common_vendor.unref(src_utils_date.formatAge)(child.birthday)),
            d: common_vendor.t(child.gender === "male" ? "男" : "女"),
            e: child._id === currentChildId.value
          }, child._id === currentChildId.value ? {} : {}, {
            f: child._id === currentChildId.value ? 1 : "",
            g: child._id,
            h: common_vendor.o(($event) => handleSelectChild(child), child._id)
          });
        }),
        d: common_vendor.o(handleAddChild),
        e: common_vendor.o(() => {
        }),
        f: common_vendor.o(handleClose)
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-374326ff"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/components/ChildSwitchModal.js.map
