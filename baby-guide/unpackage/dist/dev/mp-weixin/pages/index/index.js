"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_children = require("../../src/store/modules/children.js");
const src_store_modules_health = require("../../src/store/modules/health.js");
const src_store_modules_user = require("../../src/store/modules/user.js");
const src_utils_date = require("../../src/utils/date.js");
const src_utils_theme = require("../../src/utils/theme.js");
if (!Math) {
  (TemperatureModal + MedicineModal + SymptomModal + QuickAddModal + ChildSwitchModal)();
}
const ChildSwitchModal = () => "../../src/components/ChildSwitchModal.js";
const MedicineModal = () => "../../src/components/MedicineModal.js";
const QuickAddModal = () => "../../src/components/QuickAddModal.js";
const SymptomModal = () => "../../src/components/SymptomModal.js";
const TemperatureModal = () => "../../src/components/TemperatureModal.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const childrenStore = src_store_modules_children.useChildrenStore();
    const userStore = src_store_modules_user.useUserStore();
    const healthStore = src_store_modules_health.useHealthStore();
    const isLoggedIn = common_vendor.computed(() => userStore.isLoggedIn);
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
    async function handleLogin() {
      common_vendor.index.showLoading({ title: "登录中...", mask: true });
      const res = await userStore.login();
      common_vendor.index.hideLoading();
      if (res.success) {
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        await childrenStore.fetchChildren();
      } else {
        common_vendor.index.showToast({ title: res.errMsg || "登录失败", icon: "none" });
      }
    }
    function handleAddChild() {
      common_vendor.index.navigateTo({ url: "/pages/profile/addChild" });
    }
    function handleChildClick() {
      common_vendor.index.navigateTo({ url: "/pages/profile/childDetail" });
    }
    function handleRecordSuccess() {
    }
    function handleChildChange(child) {
      childrenStore.setCurrentChild(child);
      if (child._id) {
        healthStore.fetchTemperatureRecords(child._id);
        healthStore.fetchMedicineRecords(child._id);
        healthStore.fetchSymptomRecords(child._id);
      }
    }
    common_vendor.watch(currentChild, (child) => {
      if (child && child._id) {
        healthStore.fetchHealthOverview(child._id);
      }
    }, { immediate: true });
    common_vendor.onMounted(async () => {
      userStore.checkLoginStatus();
      if (isLoggedIn.value) {
        await childrenStore.fetchChildren();
      }
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: !isLoggedIn.value
      }, !isLoggedIn.value ? {
        b: common_vendor.o(handleLogin)
      } : !currentChild.value ? {
        d: common_vendor.o(handleAddChild)
      } : common_vendor.e({
        e: common_vendor.t(((_b = (_a = currentChild.value) == null ? void 0 : _a.name) == null ? void 0 : _b.charAt(0)) || "宝"),
        f: common_vendor.t((_c = currentChild.value) == null ? void 0 : _c.name),
        g: common_vendor.t(common_vendor.unref(src_utils_date.formatAge)(currentChild.value.birthday)),
        h: common_vendor.t(currentChild.value.gender === "male" ? "男" : "女"),
        i: common_vendor.t(healthStatusEmoji.value),
        j: common_vendor.t(healthText.value),
        k: common_vendor.o(handleChildClick),
        l: childrenList.value.length > 1
      }, childrenList.value.length > 1 ? {
        m: common_vendor.o(($event) => showChildSwitch.value = true)
      } : {}, {
        n: common_vendor.t(((_d = latestTemperature.value) == null ? void 0 : _d.temperature) || "--"),
        o: common_vendor.t(todayMedicineCount.value),
        p: common_vendor.t(todaySymptomCount.value),
        q: common_vendor.o(($event) => showTemperatureModal.value = true),
        r: common_vendor.o(($event) => showMedicineModal.value = true),
        s: common_vendor.o(($event) => showSymptomModal.value = true),
        t: recentRecords.value.length > 0
      }, recentRecords.value.length > 0 ? {
        v: common_vendor.f(recentRecords.value, (record, k0, i0) => {
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
        w: common_vendor.o(($event) => showQuickAddModal.value = true),
        x: common_vendor.o(handleRecordSuccess),
        y: common_vendor.o(($event) => showTemperatureModal.value = $event),
        z: common_vendor.p({
          show: showTemperatureModal.value
        }),
        A: common_vendor.o(handleRecordSuccess),
        B: common_vendor.o(($event) => showMedicineModal.value = $event),
        C: common_vendor.p({
          show: showMedicineModal.value
        }),
        D: common_vendor.o(handleRecordSuccess),
        E: common_vendor.o(($event) => showSymptomModal.value = $event),
        F: common_vendor.p({
          show: showSymptomModal.value
        }),
        G: common_vendor.o(handleRecordSuccess),
        H: common_vendor.o(($event) => showQuickAddModal.value = $event),
        I: common_vendor.p({
          show: showQuickAddModal.value
        }),
        J: common_vendor.o(handleChildChange),
        K: common_vendor.o(($event) => showChildSwitch.value = $event),
        L: common_vendor.p({
          show: showChildSwitch.value
        })
      }), {
        c: !currentChild.value,
        M: common_vendor.n(themeClass.value)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
