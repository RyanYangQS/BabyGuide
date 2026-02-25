"use strict";
const common_vendor = require("../../../common/vendor.js");
const src_utils_theme = require("../../utils/theme.js");
const useHealthStore = common_vendor.defineStore("health", () => {
  const temperatureRecords = common_vendor.ref([]);
  const medicineRecords = common_vendor.ref([]);
  const symptomRecords = common_vendor.ref([]);
  const currentHealthStatus = common_vendor.ref(src_utils_theme.HealthStatus.Healthy);
  const latestTemperature = common_vendor.computed(() => {
    if (temperatureRecords.value.length === 0)
      return null;
    return temperatureRecords.value[0];
  });
  const todayTemperatureRecords = common_vendor.computed(() => {
    const today = (/* @__PURE__ */ new Date()).toDateString();
    return temperatureRecords.value.filter(
      (record) => new Date(record.measureTime).toDateString() === today
    );
  });
  const todayMedicineRecords = common_vendor.computed(() => {
    const today = (/* @__PURE__ */ new Date()).toDateString();
    return medicineRecords.value.filter(
      (record) => new Date(record.takeTime).toDateString() === today
    );
  });
  function setTemperatureRecords(records) {
    temperatureRecords.value = records.sort(
      (a, b) => new Date(b.measureTime).getTime() - new Date(a.measureTime).getTime()
    );
    if (records.length > 0) {
      const latest = records[0];
      currentHealthStatus.value = src_utils_theme.getHealthStatus(latest.temperature);
    }
  }
  function addTemperatureRecord(record) {
    temperatureRecords.value.unshift(record);
    temperatureRecords.value.sort(
      (a, b) => new Date(b.measureTime).getTime() - new Date(a.measureTime).getTime()
    );
    currentHealthStatus.value = src_utils_theme.getHealthStatus(record.temperature);
  }
  function setMedicineRecords(records) {
    medicineRecords.value = records.sort(
      (a, b) => new Date(b.takeTime).getTime() - new Date(a.takeTime).getTime()
    );
  }
  function addMedicineRecord(record) {
    medicineRecords.value.unshift(record);
  }
  function setSymptomRecords(records) {
    symptomRecords.value = records.sort(
      (a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime()
    );
  }
  function addSymptomRecord(record) {
    symptomRecords.value.unshift(record);
  }
  function clearRecords() {
    temperatureRecords.value = [];
    medicineRecords.value = [];
    symptomRecords.value = [];
    currentHealthStatus.value = src_utils_theme.HealthStatus.Healthy;
  }
  return {
    temperatureRecords,
    medicineRecords,
    symptomRecords,
    currentHealthStatus,
    latestTemperature,
    todayTemperatureRecords,
    todayMedicineRecords,
    setTemperatureRecords,
    addTemperatureRecord,
    setMedicineRecords,
    addMedicineRecord,
    setSymptomRecords,
    addSymptomRecord,
    clearRecords
  };
});
exports.useHealthStore = useHealthStore;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/src/store/modules/health.js.map
