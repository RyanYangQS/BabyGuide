"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_health = require("../store/modules/health.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "TemperatureModal",
  props: {
    show: { type: Boolean }
  },
  emits: ["update:show", "success"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const healthStore = src_store_modules_health.useHealthStore();
    const loading = common_vendor.ref(false);
    const quickTemps = ["36.5", "37.0", "37.5", "38.0", "38.5", "39.0"];
    const measureParts = [
      { value: "ear", label: "耳温", icon: "👂" },
      { value: "axillary", label: "腋下", icon: "💪" },
      { value: "oral", label: "口腔", icon: "👄" },
      { value: "rectal", label: "直肠", icon: "🌡️" }
    ];
    const formData = common_vendor.reactive({
      temperature: "",
      measurePart: "ear",
      notes: ""
    });
    function handleClose() {
      emit("update:show", false);
      resetForm();
    }
    function resetForm() {
      formData.temperature = "";
      formData.measurePart = "ear";
      formData.notes = "";
    }
    async function handleSubmit() {
      if (!formData.temperature) {
        common_vendor.index.showToast({ title: "请输入体温", icon: "none" });
        return;
      }
      const temp = parseFloat(formData.temperature);
      if (isNaN(temp) || temp < 35 || temp > 42) {
        common_vendor.index.showToast({ title: "体温范围应在35-42°C之间", icon: "none" });
        return;
      }
      loading.value = true;
      try {
        healthStore.addTemperatureRecord({
          _id: Date.now().toString(),
          childId: "1",
          temperature: temp,
          measureTime: (/* @__PURE__ */ new Date()).toISOString(),
          measurePart: formData.measurePart,
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
        c: formData.temperature,
        d: common_vendor.o(($event) => formData.temperature = $event.detail.value),
        e: common_vendor.f(quickTemps, (temp, index, i0) => {
          return {
            a: common_vendor.t(temp),
            b: "temp-" + index,
            c: formData.temperature === temp ? 1 : "",
            d: common_vendor.o(($event) => formData.temperature = temp, "temp-" + index)
          };
        }),
        f: common_vendor.f(measureParts, (part, index, i0) => {
          return {
            a: common_vendor.t(part.icon),
            b: common_vendor.t(part.label),
            c: "part-" + index,
            d: formData.measurePart === part.value ? 1 : "",
            e: common_vendor.o(($event) => formData.measurePart = part.value, "part-" + index)
          };
        }),
        g: formData.notes,
        h: common_vendor.o(($event) => formData.notes = $event.detail.value),
        i: common_vendor.o(handleClose),
        j: common_vendor.o(handleSubmit),
        k: common_vendor.o(() => {
        }),
        l: common_vendor.o(handleClose)
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ee0bc8bd"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/components/TemperatureModal.js.map
