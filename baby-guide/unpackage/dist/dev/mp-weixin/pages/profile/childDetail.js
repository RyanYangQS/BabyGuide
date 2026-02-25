"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_children = require("../../src/store/modules/children.js");
const src_store_modules_health = require("../../src/store/modules/health.js");
const src_utils_date = require("../../src/utils/date.js");
const defaultAvatar = "/static/logo.png";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "childDetail",
  setup(__props) {
    const childrenStore = src_store_modules_children.useChildrenStore();
    const healthStore = src_store_modules_health.useHealthStore();
    const childInfo = common_vendor.computed(() => childrenStore.currentChild);
    const stats = common_vendor.computed(() => ({
      temperatureCount: healthStore.temperatureRecords.filter((r) => {
        var _a;
        return r.childId === ((_a = childInfo.value) == null ? void 0 : _a._id);
      }).length,
      medicineCount: healthStore.medicineRecords.filter((r) => {
        var _a;
        return r.childId === ((_a = childInfo.value) == null ? void 0 : _a._id);
      }).length,
      symptomCount: healthStore.symptomRecords.filter((r) => {
        var _a;
        return r.childId === ((_a = childInfo.value) == null ? void 0 : _a._id);
      }).length
    }));
    function handleEdit() {
      common_vendor.index.navigateTo({
        url: "/pages/profile/addChild"
      });
    }
    function handleDelete() {
      common_vendor.index.showModal({
        title: "确认删除",
        content: "删除后将无法恢复，确定要删除吗？",
        confirmColor: "#FF4D4F",
        success: (res) => {
          if (res.confirm) {
            if (childInfo.value) {
              childrenStore.removeChild(childInfo.value._id);
            }
            common_vendor.index.showToast({
              title: "删除成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          }
        }
      });
    }
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      return common_vendor.e({
        a: ((_a = childInfo.value) == null ? void 0 : _a.avatar) || defaultAvatar,
        b: common_vendor.t((_b = childInfo.value) == null ? void 0 : _b.name),
        c: common_vendor.t(common_vendor.unref(src_utils_date.formatAge)(((_c = childInfo.value) == null ? void 0 : _c.birthday) || "")),
        d: common_vendor.t(((_d = childInfo.value) == null ? void 0 : _d.gender) === "male" ? "男" : "女"),
        e: common_vendor.o(handleEdit),
        f: common_vendor.t(((_e = childInfo.value) == null ? void 0 : _e.birthday) || "--"),
        g: common_vendor.t(((_f = childInfo.value) == null ? void 0 : _f.bloodType) || "--"),
        h: common_vendor.t(((_h = (_g = childInfo.value) == null ? void 0 : _g.allergies) == null ? void 0 : _h.join("、")) || "无"),
        i: (_i = childInfo.value) == null ? void 0 : _i.notes
      }, ((_j = childInfo.value) == null ? void 0 : _j.notes) ? {
        j: common_vendor.t((_k = childInfo.value) == null ? void 0 : _k.notes)
      } : {}, {
        k: common_vendor.t(stats.value.temperatureCount),
        l: common_vendor.t(stats.value.medicineCount),
        m: common_vendor.t(stats.value.symptomCount),
        n: common_vendor.o(handleDelete)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d4c72c0e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/childDetail.js.map
