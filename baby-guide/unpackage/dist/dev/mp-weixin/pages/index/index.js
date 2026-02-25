"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_children = require("../../src/store/modules/children.js");
const src_store_modules_health = require("../../src/store/modules/health.js");
const src_utils_theme = require("../../src/utils/theme.js");
const src_utils_date = require("../../src/utils/date.js");
if (!Math) {
  (TemperatureModal + MedicineModal + SymptomModal + QuickAddModal + ChildSwitchModal)();
}
const TemperatureModal = () => "../../src/components/TemperatureModal.js";
const MedicineModal = () => "../../src/components/MedicineModal.js";
const SymptomModal = () => "../../src/components/SymptomModal.js";
const QuickAddModal = () => "../../src/components/QuickAddModal.js";
const ChildSwitchModal = () => "../../src/components/ChildSwitchModal.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const childrenStore = src_store_modules_children.useChildrenStore();
    const healthStore = src_store_modules_health.useHealthStore();
    const showTemperatureModal = common_vendor.ref(false);
    const showMedicineModal = common_vendor.ref(false);
    const showSymptomModal = common_vendor.ref(false);
    const showQuickAddModal = common_vendor.ref(false);
    const showChildSwitch = common_vendor.ref(false);
    const currentChild = common_vendor.computed(() => childrenStore.currentChild);
    const childrenList = common_vendor.computed(() => childrenStore.childrenList);
    const latestTemperature = common_vendor.computed(() => healthStore.latestTemperature);
    const todayMedicineCount = common_vendor.computed(() => healthStore.todayMedicineRecords.length);
    const todaySymptomCount = common_vendor.computed(() => healthStore.symptomRecords.length);
    const currentHealthStatus = common_vendor.computed(() => healthStore.currentHealthStatus);
    const themeClass = common_vendor.computed(() => `theme-${currentHealthStatus.value}`);
    const healthText = common_vendor.computed(() => {
      const statusMap = {
        "healthy": "健康状态良好",
        "low-fever": "低热状态",
        "fever": "发热状态"
      };
      return statusMap[currentHealthStatus.value] || "健康状态良好";
    });
    const healthStatusEmoji = common_vendor.computed(() => {
      const emojiMap = {
        "healthy": "🟢",
        "low-fever": "🟡",
        "fever": "🔴"
      };
      return emojiMap[currentHealthStatus.value] || "🟢";
    });
    const recentRecords = common_vendor.computed(() => {
      const records = [];
      healthStore.temperatureRecords.slice(0, 3).forEach((record) => {
        const status = src_utils_theme.getHealthStatus(record.temperature);
        const statusText = status === "healthy" ? "正常" : status === "low-fever" ? "低热" : "高热";
        records.push({
          _id: record._id,
          type: status === "fever" ? "high-fever" : status === "low-fever" ? "low-fever" : "normal",
          icon: status === "healthy" ? "🟢" : status === "low-fever" ? "🟡" : "🔴",
          title: `体温 ${record.temperature}℃`,
          time: src_utils_date.formatDate(record.measureTime, "今天 HH:mm"),
          content: `${statusText} | ${getMeasurePartText(record.measurePart)}`,
          sortTime: new Date(record.measureTime).getTime()
        });
      });
      healthStore.medicineRecords.slice(0, 3).forEach((record) => {
        records.push({
          _id: record._id,
          type: "medicine",
          icon: "💊",
          title: `用药 ${record.medicineName}`,
          time: src_utils_date.formatDate(record.takeTime, "今天 HH:mm"),
          content: `剂量: ${record.dosage}${record.unit}`,
          sortTime: new Date(record.takeTime).getTime()
        });
      });
      healthStore.symptomRecords.slice(0, 3).forEach((record) => {
        records.push({
          _id: record._id,
          type: "symptom",
          icon: "📝",
          title: `症状 ${record.symptoms.join("、")}`,
          time: src_utils_date.formatDate(record.recordTime, "今天 HH:mm"),
          content: `严重程度: ${getSeverityText(record.severity)}`,
          sortTime: new Date(record.recordTime).getTime()
        });
      });
      return records.sort((a, b) => b.sortTime - a.sortTime).slice(0, 5);
    });
    function getMeasurePartText(part) {
      const partMap = {
        oral: "口腔测量",
        axillary: "腋下测量",
        rectal: "直肠测量",
        ear: "耳温测量"
      };
      return partMap[part] || part;
    }
    function getSeverityText(severity) {
      const severityMap = {
        mild: "轻微",
        moderate: "中等",
        severe: "严重"
      };
      return severityMap[severity] || severity;
    }
    function handleChildClick() {
      if (currentChild.value) {
        common_vendor.index.navigateTo({ url: "/pages/profile/childDetail" });
      } else {
        common_vendor.index.navigateTo({ url: "/pages/profile/addChild" });
      }
    }
    function handleRecordSuccess() {
    }
    function handleChildChange(child) {
      common_vendor.index.__f__("log", "at pages/index/index.vue:240", "切换儿童:", child.name);
    }
    function loadHealthData() {
      const mockTemperatureRecords = [
        {
          _id: "1",
          childId: "1",
          temperature: 38.5,
          measureTime: (/* @__PURE__ */ new Date()).toISOString(),
          measurePart: "axillary",
          createTime: (/* @__PURE__ */ new Date()).toISOString()
        },
        {
          _id: "2",
          childId: "1",
          temperature: 37.8,
          measureTime: new Date(Date.now() - 4 * 60 * 60 * 1e3).toISOString(),
          measurePart: "axillary",
          createTime: new Date(Date.now() - 4 * 60 * 60 * 1e3).toISOString()
        },
        {
          _id: "3",
          childId: "1",
          temperature: 39.2,
          measureTime: new Date(Date.now() - 8 * 60 * 60 * 1e3).toISOString(),
          measurePart: "ear",
          createTime: new Date(Date.now() - 8 * 60 * 60 * 1e3).toISOString()
        }
      ];
      const mockMedicineRecords = [
        {
          _id: "1",
          childId: "1",
          medicineId: "1",
          medicineName: "美林",
          dosage: "5",
          unit: "ml",
          takeTime: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString(),
          createTime: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString()
        }
      ];
      healthStore.setTemperatureRecords(mockTemperatureRecords);
      healthStore.setMedicineRecords(mockMedicineRecords);
    }
    function initMockData() {
      if (childrenStore.childrenList.length === 0) {
        const mockChild = {
          _id: "1",
          name: "小明",
          avatar: "",
          gender: "male",
          birthday: "2022-06-15",
          createTime: (/* @__PURE__ */ new Date()).toISOString(),
          updateTime: (/* @__PURE__ */ new Date()).toISOString()
        };
        childrenStore.setCurrentChild(mockChild);
        childrenStore.setChildrenList([mockChild]);
      }
      loadHealthData();
    }
    common_vendor.onMounted(() => {
      initMockData();
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: common_vendor.t(((_b = (_a = currentChild.value) == null ? void 0 : _a.name) == null ? void 0 : _b.charAt(0)) || "宝"),
        b: common_vendor.t(((_c = currentChild.value) == null ? void 0 : _c.name) || "点击添加儿童档案"),
        c: currentChild.value
      }, currentChild.value ? {
        d: common_vendor.t(common_vendor.unref(src_utils_date.formatAge)(currentChild.value.birthday)),
        e: common_vendor.t(currentChild.value.gender === "male" ? "男" : "女")
      } : {}, {
        f: currentChild.value
      }, currentChild.value ? {
        g: common_vendor.t(healthStatusEmoji.value),
        h: common_vendor.t(healthText.value)
      } : {}, {
        i: common_vendor.o(handleChildClick),
        j: childrenList.value.length > 1
      }, childrenList.value.length > 1 ? {
        k: common_vendor.o(($event) => showChildSwitch.value = true)
      } : {}, {
        l: common_vendor.t(((_d = latestTemperature.value) == null ? void 0 : _d.temperature) || "--"),
        m: common_vendor.t(todayMedicineCount.value),
        n: common_vendor.t(todaySymptomCount.value),
        o: common_vendor.o(($event) => showTemperatureModal.value = true),
        p: common_vendor.o(($event) => showMedicineModal.value = true),
        q: common_vendor.o(($event) => showSymptomModal.value = true),
        r: recentRecords.value.length > 0
      }, recentRecords.value.length > 0 ? {
        s: common_vendor.f(recentRecords.value, (record, k0, i0) => {
          return {
            a: common_vendor.t(record.icon),
            b: common_vendor.t(record.title),
            c: common_vendor.t(record.time),
            d: common_vendor.t(record.content),
            e: common_vendor.n(record.type),
            f: record._id
          };
        })
      } : {}, {
        t: common_vendor.o(($event) => showQuickAddModal.value = true),
        v: common_vendor.o(handleRecordSuccess),
        w: common_vendor.o(($event) => showTemperatureModal.value = $event),
        x: common_vendor.p({
          show: showTemperatureModal.value
        }),
        y: common_vendor.o(handleRecordSuccess),
        z: common_vendor.o(($event) => showMedicineModal.value = $event),
        A: common_vendor.p({
          show: showMedicineModal.value
        }),
        B: common_vendor.o(handleRecordSuccess),
        C: common_vendor.o(($event) => showSymptomModal.value = $event),
        D: common_vendor.p({
          show: showSymptomModal.value
        }),
        E: common_vendor.o(handleRecordSuccess),
        F: common_vendor.o(($event) => showQuickAddModal.value = $event),
        G: common_vendor.p({
          show: showQuickAddModal.value
        }),
        H: common_vendor.o(handleChildChange),
        I: common_vendor.o(($event) => showChildSwitch.value = $event),
        J: common_vendor.p({
          show: showChildSwitch.value
        }),
        K: common_vendor.n(themeClass.value)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
