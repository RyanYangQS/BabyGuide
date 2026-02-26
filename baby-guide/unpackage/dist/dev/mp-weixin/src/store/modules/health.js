"use strict";
const common_vendor = require("../../../common/vendor.js");
const src_api_index = require("../../api/index.js");
const src_utils_theme = require("../../utils/theme.js");
const useHealthStore = common_vendor.defineStore("health", () => {
  const temperatureRecords = common_vendor.ref([]);
  const medicineRecords = common_vendor.ref([]);
  const symptomRecords = common_vendor.ref([]);
  const currentHealthStatus = common_vendor.ref(src_utils_theme.HealthStatus.Healthy);
  const loading = common_vendor.ref(false);
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
  async function fetchTemperatureRecords(childId, startDate, endDate) {
    loading.value = true;
    const res = await src_api_index.getTemperatureRecords({ childId, startDate, endDate });
    loading.value = false;
    if (res.success && res.data) {
      setTemperatureRecords(res.data.list);
    }
    return res;
  }
  async function addTemperatureRecordApi(data) {
    const res = await src_api_index.addTemperature(data);
    if (res.success && res.data) {
      addTemperatureRecord(res.data);
    }
    return res;
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
  async function fetchMedicineRecords(childId, startDate, endDate) {
    loading.value = true;
    const res = await src_api_index.getMedicineRecords({ childId, startDate, endDate });
    loading.value = false;
    if (res.success && res.data) {
      setMedicineRecords(res.data.list);
    }
    return res;
  }
  async function addMedicineRecordApi(data) {
    const res = await src_api_index.addMedicineRecord(data);
    if (res.success && res.data) {
      addMedicineRecord(res.data);
    }
    return res;
  }
  function addMedicineRecord(record) {
    medicineRecords.value.unshift(record);
  }
  function setSymptomRecords(records) {
    symptomRecords.value = records.sort(
      (a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime()
    );
  }
  async function fetchSymptomRecords(childId, startDate, endDate) {
    loading.value = true;
    const res = await src_api_index.getSymptomRecords({ childId, startDate, endDate });
    loading.value = false;
    if (res.success && res.data) {
      setSymptomRecords(res.data.list);
    }
    return res;
  }
  async function addSymptomRecordApi(data) {
    const res = await src_api_index.addSymptomRecord(data);
    if (res.success && res.data) {
      addSymptomRecord(res.data);
    }
    return res;
  }
  function addSymptomRecord(record) {
    symptomRecords.value.unshift(record);
  }
  async function fetchHealthOverview(childId) {
    loading.value = true;
    const res = await src_api_index.getHealthOverview(childId);
    loading.value = false;
    if (res.success && res.data) {
      const { latestTemperature: latestTemperature2, healthStatus } = res.data;
      currentHealthStatus.value = healthStatus;
      if (latestTemperature2) {
        const exists = temperatureRecords.value.find((r) => r._id === latestTemperature2._id);
        if (!exists) {
          temperatureRecords.value.unshift(latestTemperature2);
        }
      }
    }
    return res;
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
    loading,
    latestTemperature,
    todayTemperatureRecords,
    todayMedicineRecords,
    setTemperatureRecords,
    fetchTemperatureRecords,
    addTemperatureRecordApi,
    addTemperatureRecord,
    setMedicineRecords,
    fetchMedicineRecords,
    addMedicineRecordApi,
    addMedicineRecord,
    setSymptomRecords,
    fetchSymptomRecords,
    addSymptomRecordApi,
    addSymptomRecord,
    fetchHealthOverview,
    clearRecords
  };
});
exports.useHealthStore = useHealthStore;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/src/store/modules/health.js.map
