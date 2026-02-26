"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_health = require("../store/modules/health.js");
const src_store_modules_children = require("../store/modules/children.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "SymptomModal",
  props: {
    show: { type: Boolean }
  },
  emits: ["update:show", "success"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const healthStore = src_store_modules_health.useHealthStore();
    const childrenStore = src_store_modules_children.useChildrenStore();
    const loading = common_vendor.ref(false);
    const symptomOptions = [
      { value: "发热", label: "发热", icon: "🌡️" },
      { value: "咳嗽", label: "咳嗽", icon: "😷" },
      { value: "流涕", label: "流涕", icon: "🤧" },
      { value: "咽痛", label: "咽痛", icon: "😫" },
      { value: "呕吐", label: "呕吐", icon: "🤢" },
      { value: "腹泻", label: "腹泻", icon: "💩" },
      { value: "皮疹", label: "皮疹", icon: "🔴" },
      { value: "头痛", label: "头痛", icon: "🤕" },
      { value: "腹痛", label: "腹痛", icon: "😣" },
      { value: "食欲不振", label: "食欲不振", icon: "🍽️" }
    ];
    const severityLevels = [
      { value: "mild", label: "轻微", color: "#52C41A" },
      { value: "moderate", label: "中等", color: "#FAAD14" },
      { value: "severe", label: "严重", color: "#FF4D4F" }
    ];
    const formData = common_vendor.reactive({
      symptoms: [],
      severity: "mild",
      description: ""
    });
    function toggleSymptom(symptom) {
      const index = formData.symptoms.indexOf(symptom);
      if (index === -1) {
        formData.symptoms.push(symptom);
      } else {
        formData.symptoms.splice(index, 1);
      }
    }
    function handleClose() {
      emit("update:show", false);
      resetForm();
    }
    function resetForm() {
      formData.symptoms = [];
      formData.severity = "mild";
      formData.description = "";
    }
    async function handleSubmit() {
      if (formData.symptoms.length === 0) {
        common_vendor.index.showToast({ title: "请至少选择一项症状", icon: "none" });
        return;
      }
      const currentChild = childrenStore.currentChild;
      if (!currentChild) {
        common_vendor.index.showToast({ title: "请先添加儿童档案", icon: "none" });
        return;
      }
      loading.value = true;
      try {
        const res = await healthStore.addSymptomRecordApi({
          childId: currentChild._id,
          symptoms: formData.symptoms,
          severity: formData.severity,
          recordTime: (/* @__PURE__ */ new Date()).toISOString(),
          notes: formData.description
        });
        if (res.success) {
          common_vendor.index.showToast({ title: "记录成功", icon: "success" });
          emit("success");
          handleClose();
        }
      } finally {
        loading.value = false;
      }
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: _ctx.show
      }, _ctx.show ? {
        b: common_vendor.o(handleClose),
        c: common_vendor.f(symptomOptions, (symptom, index, i0) => {
          return {
            a: common_vendor.t(symptom.icon),
            b: common_vendor.t(symptom.label),
            c: "symptom-" + index,
            d: formData.symptoms.includes(symptom.value) ? 1 : "",
            e: common_vendor.o(($event) => toggleSymptom(symptom.value), "symptom-" + index)
          };
        }),
        d: common_vendor.f(severityLevels, (level, index, i0) => {
          return {
            a: level.color,
            b: common_vendor.t(level.label),
            c: "severity-" + index,
            d: formData.severity === level.value ? 1 : "",
            e: common_vendor.o(($event) => formData.severity = level.value, "severity-" + index)
          };
        }),
        e: formData.description,
        f: common_vendor.o(($event) => formData.description = $event.detail.value),
        g: common_vendor.o(handleClose),
        h: common_vendor.o(handleSubmit),
        i: common_vendor.o(() => {
        }),
        j: common_vendor.o(handleClose)
      } : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7adfb1c2"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/components/SymptomModal.js.map
