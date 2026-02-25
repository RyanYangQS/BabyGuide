"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_health = require("../../src/store/modules/health.js");
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
    const timeFilter = common_vendor.ref("today");
    const showAddModal = common_vendor.ref(false);
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
    }
    common_vendor.onMounted(() => {
      if (temperatureRecords.value.length === 0) {
        const mockRecords = [
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
        healthStore.setTemperatureRecords(mockRecords);
      }
    });
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: common_vendor.t(healthStatusText.value),
        b: common_vendor.n(statusClass.value),
        c: common_vendor.t(((_a = latestTemperature.value) == null ? void 0 : _a.temperature) || "--"),
        d: latestTemperature.value
      }, latestTemperature.value ? {
        e: common_vendor.t(common_vendor.unref(src_utils_date.formatDate)(latestTemperature.value.measureTime, "YYYY-MM-DD HH:mm"))
      } : {}, {
        f: timeFilter.value === "today" ? 1 : "",
        g: common_vendor.o(($event) => timeFilter.value = "today"),
        h: timeFilter.value === "yesterday" ? 1 : "",
        i: common_vendor.o(($event) => timeFilter.value = "yesterday"),
        j: timeFilter.value === "week" ? 1 : "",
        k: common_vendor.o(($event) => timeFilter.value = "week"),
        l: !showAddModal.value
      }, !showAddModal.value ? {
        m: common_vendor.p({
          data: chartData.value,
          height: 300
        })
      } : {}, {
        n: common_vendor.t(temperatureStats.value.max),
        o: common_vendor.t(temperatureStats.value.min),
        p: common_vendor.t(temperatureStats.value.avg),
        q: temperatureRecords.value.length > 0
      }, temperatureRecords.value.length > 0 ? {
        r: common_vendor.f(temperatureRecords.value, (record, k0, i0) => {
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
        s: common_vendor.o(($event) => showAddModal.value = true),
        t: common_vendor.o(handleRecordSuccess),
        v: common_vendor.o(($event) => showAddModal.value = $event),
        w: common_vendor.p({
          show: showAddModal.value
        }),
        x: common_vendor.n(themeClass.value)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-91920ce0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/temperature/index.js.map
