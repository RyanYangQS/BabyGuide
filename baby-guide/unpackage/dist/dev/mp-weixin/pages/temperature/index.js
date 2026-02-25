"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_health = require("../../src/store/modules/health.js");
const src_utils_theme = require("../../src/utils/theme.js");
const src_utils_date = require("../../src/utils/date.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const healthStore = src_store_modules_health.useHealthStore();
    const selectedDate = common_vendor.ref(src_utils_date.formatDate(/* @__PURE__ */ new Date(), "YYYY-MM-DD"));
    const temperatureRecords = common_vendor.computed(() => healthStore.temperatureRecords);
    const latestTemperature = common_vendor.computed(() => healthStore.latestTemperature);
    const currentHealthStatus = common_vendor.computed(() => healthStore.currentHealthStatus);
    const themeClass = common_vendor.computed(() => `theme-${currentHealthStatus.value}`);
    const healthStatusText = common_vendor.computed(() => {
      const statusMap = {
        [src_utils_theme.HealthStatus.Healthy]: "正常",
        [src_utils_theme.HealthStatus.LowFever]: "低烧",
        [src_utils_theme.HealthStatus.Fever]: "发烧"
      };
      return statusMap[currentHealthStatus.value];
    });
    function getThemeClass(temperature) {
      const status = src_utils_theme.getHealthStatus(temperature);
      return `theme-${status}`;
    }
    function getTemperatureStatus(temperature) {
      const status = src_utils_theme.getHealthStatus(temperature);
      const statusMap = {
        [src_utils_theme.HealthStatus.Healthy]: "正常",
        [src_utils_theme.HealthStatus.LowFever]: "低烧",
        [src_utils_theme.HealthStatus.Fever]: "发烧"
      };
      return statusMap[status];
    }
    function getMeasurePartText(part) {
      const partMap = {
        oral: "口腔",
        axillary: "腋下",
        rectal: "直肠",
        ear: "耳温"
      };
      return partMap[part] || part;
    }
    function handleDateChange(e) {
      selectedDate.value = e.detail.value;
    }
    function handleAdd() {
      common_vendor.index.showToast({
        title: "添加体温记录",
        icon: "none"
      });
    }
    common_vendor.onMounted(() => {
      if (temperatureRecords.value.length === 0) {
        const mockRecords = [
          {
            _id: "1",
            childId: "1",
            temperature: 36.5,
            measureTime: (/* @__PURE__ */ new Date()).toISOString(),
            measurePart: "axillary",
            createTime: (/* @__PURE__ */ new Date()).toISOString()
          },
          {
            _id: "2",
            childId: "1",
            temperature: 37.2,
            measureTime: new Date(Date.now() - 4 * 60 * 60 * 1e3).toISOString(),
            measurePart: "axillary",
            createTime: new Date(Date.now() - 4 * 60 * 60 * 1e3).toISOString()
          },
          {
            _id: "3",
            childId: "1",
            temperature: 38.1,
            measureTime: new Date(Date.now() - 8 * 60 * 60 * 1e3).toISOString(),
            measurePart: "axillary",
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
        b: common_vendor.n(themeClass.value),
        c: common_vendor.t(((_a = latestTemperature.value) == null ? void 0 : _a.temperature) || "--"),
        d: latestTemperature.value
      }, latestTemperature.value ? {
        e: common_vendor.t(common_vendor.unref(src_utils_date.formatDate)(latestTemperature.value.measureTime, "YYYY-MM-DD HH:mm"))
      } : {}, {
        f: common_vendor.n(themeClass.value),
        g: temperatureRecords.value.length > 0
      }, temperatureRecords.value.length > 0 ? {
        h: common_vendor.t(selectedDate.value),
        i: common_vendor.o(handleDateChange)
      } : {}, {
        j: common_vendor.t(temperatureRecords.value.length),
        k: temperatureRecords.value.length > 0
      }, temperatureRecords.value.length > 0 ? {
        l: common_vendor.f(temperatureRecords.value, (record, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(record.temperature),
            b: common_vendor.t(getTemperatureStatus(record.temperature)),
            c: common_vendor.n(getThemeClass(record.temperature)),
            d: common_vendor.t(common_vendor.unref(src_utils_date.formatDate)(record.measureTime, "MM-DD HH:mm")),
            e: common_vendor.t(getMeasurePartText(record.measurePart)),
            f: record.notes
          }, record.notes ? {
            g: common_vendor.t(record.notes)
          } : {}, {
            h: record._id,
            i: common_vendor.n(getThemeClass(record.temperature))
          });
        })
      } : {}, {
        m: common_vendor.o(handleAdd)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-91920ce0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/temperature/index.js.map
