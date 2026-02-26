"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_health = require("../../src/store/modules/health.js");
const src_store_modules_children = require("../../src/store/modules/children.js");
const src_store_modules_user = require("../../src/store/modules/user.js");
const src_utils_theme = require("../../src/utils/theme.js");
const src_utils_date = require("../../src/utils/date.js");
if (!Math) {
  (TemperatureChart + TemperatureModal)();
}
const TemperatureModal = () => "../../src/components/TemperatureModal.js";
const TemperatureChart = () => "../../src/components/TemperatureChart.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const healthStore = src_store_modules_health.useHealthStore();
    const childrenStore = src_store_modules_children.useChildrenStore();
    const userStore = src_store_modules_user.useUserStore();
    const timeFilter = common_vendor.ref("today");
    const showAddModal = common_vendor.ref(false);
    const isLoggedIn = common_vendor.computed(() => userStore.isLoggedIn);
    const currentChild = common_vendor.computed(() => childrenStore.currentChild);
    const temperatureRecords = common_vendor.computed(() => healthStore.temperatureRecords);
    const latestTemperature = common_vendor.computed(() => healthStore.latestTemperature);
    const currentHealthStatus = common_vendor.computed(() => healthStore.currentHealthStatus);
    const themeClass = common_vendor.computed(() => `theme-${currentHealthStatus.value}`);
    const statusClass = common_vendor.computed(() => `status-${currentHealthStatus.value}`);
    const healthStatusText = common_vendor.computed(() => {
      const statusMap = {
        "healthy": "体温正常",
        "low-fever": "低热",
        "fever": "发热"
      };
      return statusMap[currentHealthStatus.value] || "体温正常";
    });
    const temperatureStats = common_vendor.computed(() => {
      const records = temperatureRecords.value;
      if (records.length === 0) {
        return { max: "--", min: "--", avg: "--" };
      }
      const temps = records.map((r) => r.temperature);
      const max = Math.max(...temps);
      const min = Math.min(...temps);
      const avg = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
      return { max, min, avg };
    });
    const chartData = common_vendor.computed(() => {
      return temperatureRecords.value.slice().reverse().map((record) => ({
        time: record.measureTime,
        temperature: record.temperature
      }));
    });
    function getRecordClass(temp) {
      const status = src_utils_theme.getHealthStatus(temp);
      return `record-${status}`;
    }
    function getStatusClass(temp) {
      const status = src_utils_theme.getHealthStatus(temp);
      return `status-${status}`;
    }
    function getStatusText(temp) {
      const status = src_utils_theme.getHealthStatus(temp);
      const statusMap = {
        "healthy": "正常",
        "low-fever": "低热",
        "fever": "高热"
      };
      return statusMap[status] || "正常";
    }
    function getMeasurePartText(part) {
      const partMap = {
        oral: "口腔测量",
        axillary: "腋下测量",
        rectal: "直肠测量",
        ear: "耳温测量"
      };
      return partMap[part] || part;
    }
    function handleRecordSuccess() {
      var _a;
      if ((_a = currentChild.value) == null ? void 0 : _a._id) {
        healthStore.fetchTemperatureRecords(currentChild.value._id);
      }
    }
    common_vendor.watch(currentChild, (child) => {
      if (child && child._id) {
        healthStore.fetchTemperatureRecords(child._id);
      }
    }, { immediate: true });
    common_vendor.onMounted(() => {
      userStore.checkLoginStatus();
    });
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: !isLoggedIn.value
      }, !isLoggedIn.value ? {} : !currentChild.value ? {} : common_vendor.e({
        c: common_vendor.t(healthStatusText.value),
        d: common_vendor.n(statusClass.value),
        e: common_vendor.t(((_a = latestTemperature.value) == null ? void 0 : _a.temperature) || "--"),
        f: latestTemperature.value
      }, latestTemperature.value ? {
        g: common_vendor.t(common_vendor.unref(src_utils_date.formatDate)(latestTemperature.value.measureTime, "YYYY-MM-DD HH:mm"))
      } : {}, {
        h: temperatureRecords.value.length > 0
      }, temperatureRecords.value.length > 0 ? {
        i: timeFilter.value === "today" ? 1 : "",
        j: common_vendor.o(($event) => timeFilter.value = "today"),
        k: timeFilter.value === "yesterday" ? 1 : "",
        l: common_vendor.o(($event) => timeFilter.value = "yesterday"),
        m: timeFilter.value === "week" ? 1 : "",
        n: common_vendor.o(($event) => timeFilter.value = "week"),
        o: common_vendor.p({
          data: chartData.value,
          height: 300
        })
      } : {}, {
        p: temperatureRecords.value.length > 0
      }, temperatureRecords.value.length > 0 ? {
        q: common_vendor.t(temperatureStats.value.max),
        r: common_vendor.t(temperatureStats.value.min),
        s: common_vendor.t(temperatureStats.value.avg)
      } : {}, {
        t: temperatureRecords.value.length > 0
      }, temperatureRecords.value.length > 0 ? {
        v: common_vendor.f(temperatureRecords.value, (record, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(record.temperature),
            b: common_vendor.t(getStatusText(record.temperature)),
            c: common_vendor.n(getStatusClass(record.temperature)),
            d: common_vendor.t(common_vendor.unref(src_utils_date.formatDate)(record.measureTime, "MM-DD HH:mm")),
            e: common_vendor.t(getMeasurePartText(record.measurePart)),
            f: record.notes
          }, record.notes ? {
            g: common_vendor.t(record.notes)
          } : {}, {
            h: common_vendor.n(getRecordClass(record.temperature)),
            i: record._id
          });
        })
      } : {}, {
        w: common_vendor.o(($event) => showAddModal.value = true),
        x: common_vendor.o(handleRecordSuccess),
        y: common_vendor.o(($event) => showAddModal.value = $event),
        z: common_vendor.p({
          show: showAddModal.value
        })
      }), {
        b: !currentChild.value,
        A: common_vendor.n(themeClass.value)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-91920ce0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/temperature/index.js.map
