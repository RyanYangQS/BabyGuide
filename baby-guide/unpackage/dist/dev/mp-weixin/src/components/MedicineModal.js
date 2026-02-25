"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_health = require("../store/modules/health.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "MedicineModal",
  props: {
    show: { type: Boolean }
  },
  emits: ["update:show", "success"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const healthStore = src_store_modules_health.useHealthStore();
    const loading = common_vendor.ref(false);
    const commonMedicines = ["美林", "泰诺林", "小儿氨酚黄那敏颗粒", "布洛芬"];
    const units = ["ml", "mg", "片", "袋"];
    const formData = common_vendor.reactive({
      medicineName: "",
      dosage: "",
      unit: "ml",
      notes: ""
    });
    function handleClose() {
      emit("update:show", false);
      resetForm();
    }
    function resetForm() {
      formData.medicineName = "";
      formData.dosage = "";
      formData.unit = "ml";
      formData.notes = "";
    }
    async function handleSubmit() {
      if (!formData.medicineName) {
        common_vendor.index.showToast({ title: "请输入药品名称", icon: "none" });
        return;
      }
      if (!formData.dosage) {
        common_vendor.index.showToast({ title: "请输入剂量", icon: "none" });
        return;
      }
      loading.value = true;
      try {
        healthStore.addMedicineRecord({
          _id: Date.now().toString(),
          childId: "1",
          medicineId: "",
          medicineName: formData.medicineName,
          dosage: formData.dosage,
          unit: formData.unit,
          takeTime: (/* @__PURE__ */ new Date()).toISOString(),
          notes: formData.notes,
          createTime: (/* @__PURE__ */ new Date()).toISOString()
        });
        common_vendor.index.showToast({ title: "记录成功", icon: "success" });
        emit("success");
        handleClose();
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.show
      }, _ctx.show ? {
        b: common_vendor.o(handleClose),
        c: formData.medicineName,
        d: common_vendor.o(($event) => formData.medicineName = $event.detail.value),
        e: common_vendor.f(commonMedicines, (med, index, i0) => {
          return {
            a: common_vendor.t(med),
            b: "med-" + index,
            c: formData.medicineName === med ? 1 : "",
            d: common_vendor.o(($event) => formData.medicineName = med, "med-" + index)
          };
        }),
        f: formData.dosage,
        g: common_vendor.o(($event) => formData.dosage = $event.detail.value),
        h: common_vendor.f(units, (unit, index, i0) => {
          return {
            a: common_vendor.t(unit),
            b: "unit-" + index,
            c: formData.unit === unit ? 1 : "",
            d: common_vendor.o(($event) => formData.unit = unit, "unit-" + index)
          };
        }),
        i: formData.notes,
        j: common_vendor.o(($event) => formData.notes = $event.detail.value),
        k: common_vendor.o(handleClose),
        l: common_vendor.o(handleSubmit),
        m: common_vendor.o(() => {
        }),
        n: common_vendor.o(handleClose)
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b52edb70"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/components/MedicineModal.js.map
