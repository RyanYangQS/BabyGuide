"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_health = require("../store/modules/health.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "QuickAddModal",
  props: {
    show: { type: Boolean }
  },
  emits: ["update:show", "success"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const healthStore = src_store_modules_health.useHealthStore();
    const loading = common_vendor.ref(false);
    const activeTab = common_vendor.ref("temperature");
    const tabs = [
      { key: "temperature", label: "体温", icon: "🌡️" },
      { key: "medicine", label: "用药", icon: "💊" },
      { key: "symptom", label: "症状", icon: "📝" }
    ];
    const quickTemps = ["36.5", "37.0", "37.5", "38.0", "38.5", "39.0"];
    const measureParts = [
      { value: "ear", label: "耳温", icon: "👂" },
      { value: "axillary", label: "腋下", icon: "💪" },
      { value: "oral", label: "口腔", icon: "👄" },
      { value: "rectal", label: "直肠", icon: "🌡️" }
    ];
    const commonMedicines = ["美林", "泰诺林", "小儿氨酚黄那敏颗粒", "布洛芬"];
    const units = ["ml", "mg", "片", "袋"];
    const symptomOptions = [
      { value: "fever", label: "发热" },
      { value: "cough", label: "咳嗽" },
      { value: "runny_nose", label: "流涕" },
      { value: "sore_throat", label: "咽痛" },
      { value: "vomiting", label: "呕吐" },
      { value: "diarrhea", label: "腹泻" }
    ];
    const severityLevels = [
      { value: "mild", label: "轻微", color: "#52C41A" },
      { value: "moderate", label: "中等", color: "#FAAD14" },
      { value: "severe", label: "严重", color: "#FF4D4F" }
    ];
    const temperatureForm = common_vendor.reactive({
      temperature: "",
      measurePart: "ear",
      notes: ""
    });
    const medicineForm = common_vendor.reactive({
      medicineName: "",
      dosage: "",
      unit: "ml",
      notes: ""
    });
    const symptomForm = common_vendor.reactive({
      symptoms: [],
      severity: "mild",
      notes: ""
    });
    const currentNotes = common_vendor.computed({
      get: () => {
        switch (activeTab.value) {
          case "temperature":
            return temperatureForm.notes;
          case "medicine":
            return medicineForm.notes;
          case "symptom":
            return symptomForm.notes;
          default:
            return "";
        }
      },
      set: (val) => {
        switch (activeTab.value) {
          case "temperature":
            temperatureForm.notes = val;
            break;
          case "medicine":
            medicineForm.notes = val;
            break;
          case "symptom":
            symptomForm.notes = val;
            break;
        }
      }
    });
    function toggleSymptom(symptom) {
      const index = symptomForm.symptoms.indexOf(symptom);
      if (index === -1) {
        symptomForm.symptoms.push(symptom);
      } else {
        symptomForm.symptoms.splice(index, 1);
      }
    }
    function handleClose() {
      emit("update:show", false);
      resetForms();
    }
    function resetForms() {
      activeTab.value = "temperature";
      temperatureForm.temperature = "";
      temperatureForm.measurePart = "ear";
      temperatureForm.notes = "";
      medicineForm.medicineName = "";
      medicineForm.dosage = "";
      medicineForm.unit = "ml";
      medicineForm.notes = "";
      symptomForm.symptoms = [];
      symptomForm.severity = "mild";
      symptomForm.notes = "";
    }
    async function handleSubmit() {
      loading.value = true;
      try {
        switch (activeTab.value) {
          case "temperature":
            if (!temperatureForm.temperature) {
              common_vendor.index.showToast({ title: "请输入体温", icon: "none" });
              return;
            }
            const temp = parseFloat(temperatureForm.temperature);
            if (isNaN(temp) || temp < 35 || temp > 42) {
              common_vendor.index.showToast({ title: "体温范围应在35-42°C之间", icon: "none" });
              return;
            }
            healthStore.addTemperatureRecord({
              _id: Date.now().toString(),
              childId: "1",
              temperature: temp,
              measureTime: (/* @__PURE__ */ new Date()).toISOString(),
              measurePart: temperatureForm.measurePart,
              notes: temperatureForm.notes,
              createTime: (/* @__PURE__ */ new Date()).toISOString()
            });
            break;
          case "medicine":
            if (!medicineForm.medicineName) {
              common_vendor.index.showToast({ title: "请输入药品名称", icon: "none" });
              return;
            }
            healthStore.addMedicineRecord({
              _id: Date.now().toString(),
              childId: "1",
              medicineId: "",
              medicineName: medicineForm.medicineName,
              dosage: medicineForm.dosage || "",
              unit: medicineForm.unit,
              takeTime: (/* @__PURE__ */ new Date()).toISOString(),
              notes: medicineForm.notes,
              createTime: (/* @__PURE__ */ new Date()).toISOString()
            });
            break;
          case "symptom":
            if (symptomForm.symptoms.length === 0) {
              common_vendor.index.showToast({ title: "请至少选择一项症状", icon: "none" });
              return;
            }
            healthStore.addSymptomRecord({
              _id: Date.now().toString(),
              childId: "1",
              symptoms: symptomForm.symptoms,
              severity: symptomForm.severity,
              recordTime: (/* @__PURE__ */ new Date()).toISOString(),
              notes: symptomForm.notes,
              createTime: (/* @__PURE__ */ new Date()).toISOString()
            });
            break;
        }
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
      }, _ctx.show ? common_vendor.e({
        b: common_vendor.o(handleClose),
        c: common_vendor.f(tabs, (tab, index, i0) => {
          return {
            a: common_vendor.t(tab.icon),
            b: common_vendor.t(tab.label),
            c: "tab-" + index,
            d: activeTab.value === tab.key ? 1 : "",
            e: common_vendor.o(($event) => activeTab.value = tab.key, "tab-" + index)
          };
        }),
        d: activeTab.value === "temperature"
      }, activeTab.value === "temperature" ? {
        e: temperatureForm.temperature,
        f: common_vendor.o(($event) => temperatureForm.temperature = $event.detail.value),
        g: common_vendor.f(quickTemps, (temp, index, i0) => {
          return {
            a: common_vendor.t(temp),
            b: "temp-" + index,
            c: temperatureForm.temperature === temp ? 1 : "",
            d: common_vendor.o(($event) => temperatureForm.temperature = temp, "temp-" + index)
          };
        }),
        h: common_vendor.f(measureParts, (part, index, i0) => {
          return {
            a: common_vendor.t(part.icon),
            b: common_vendor.t(part.label),
            c: "part-" + index,
            d: temperatureForm.measurePart === part.value ? 1 : "",
            e: common_vendor.o(($event) => temperatureForm.measurePart = part.value, "part-" + index)
          };
        })
      } : {}, {
        i: activeTab.value === "medicine"
      }, activeTab.value === "medicine" ? {
        j: medicineForm.medicineName,
        k: common_vendor.o(($event) => medicineForm.medicineName = $event.detail.value),
        l: common_vendor.f(commonMedicines, (med, index, i0) => {
          return {
            a: common_vendor.t(med),
            b: "med-" + index,
            c: medicineForm.medicineName === med ? 1 : "",
            d: common_vendor.o(($event) => medicineForm.medicineName = med, "med-" + index)
          };
        }),
        m: medicineForm.dosage,
        n: common_vendor.o(($event) => medicineForm.dosage = $event.detail.value),
        o: common_vendor.f(units, (unit, index, i0) => {
          return {
            a: common_vendor.t(unit),
            b: "unit-" + index,
            c: medicineForm.unit === unit ? 1 : "",
            d: common_vendor.o(($event) => medicineForm.unit = unit, "unit-" + index)
          };
        })
      } : {}, {
        p: activeTab.value === "symptom"
      }, activeTab.value === "symptom" ? {
        q: common_vendor.f(symptomOptions, (symptom, index, i0) => {
          return {
            a: common_vendor.t(symptom.label),
            b: "symptom-" + index,
            c: symptomForm.symptoms.includes(symptom.value) ? 1 : "",
            d: common_vendor.o(($event) => toggleSymptom(symptom.value), "symptom-" + index)
          };
        }),
        r: common_vendor.f(severityLevels, (level, index, i0) => {
          return {
            a: level.color,
            b: common_vendor.t(level.label),
            c: "severity-" + index,
            d: symptomForm.severity === level.value ? 1 : "",
            e: common_vendor.o(($event) => symptomForm.severity = level.value, "severity-" + index)
          };
        })
      } : {}, {
        s: currentNotes.value,
        t: common_vendor.o(($event) => currentNotes.value = $event.detail.value),
        v: common_vendor.o(handleClose),
        w: common_vendor.o(handleSubmit),
        x: common_vendor.o(() => {
        }),
        y: common_vendor.o(handleClose)
      }) : {});
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-62b946e2"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/components/QuickAddModal.js.map
