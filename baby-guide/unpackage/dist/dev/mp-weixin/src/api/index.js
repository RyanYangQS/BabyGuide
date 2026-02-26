"use strict";
const common_vendor = require("../../common/vendor.js");
async function callFunction(name, data = {}, options = {}) {
  const { showLoading = false, loadingText = "加载中...", showError = true } = options;
  if (showLoading) {
    common_vendor.index.showLoading({ title: loadingText, mask: true });
  }
  try {
    const result = await common_vendor.index.cloud.callFunction({
      name,
      data
    });
    if (showLoading) {
      common_vendor.index.hideLoading();
    }
    const res = result.result;
    if (!res.success && showError) {
      common_vendor.index.showToast({
        title: res.errMsg || "请求失败",
        icon: "none"
      });
    }
    return res;
  } catch (err) {
    if (showLoading) {
      common_vendor.index.hideLoading();
    }
    common_vendor.index.__f__("error", "at src/api/index.ts:57", `云函数 ${name} 调用失败:`, err);
    if (showError) {
      common_vendor.index.showToast({
        title: err.message || "网络错误",
        icon: "none"
      });
    }
    return {
      success: false,
      errMsg: err.message || "网络错误"
    };
  }
}
function userLogin() {
  return callFunction("userLogin");
}
function getChildren() {
  return callFunction("getChildren");
}
function addChild(data) {
  return callFunction("addChild", data, { showLoading: true, loadingText: "添加中..." });
}
function updateChild(data) {
  return callFunction("updateChild", data, { showLoading: true, loadingText: "保存中..." });
}
function deleteChild(childId) {
  return callFunction("deleteChild", { childId }, { showLoading: true, loadingText: "删除中..." });
}
function addTemperature(data) {
  return callFunction("addTemperature", data, { showLoading: true, loadingText: "记录中..." });
}
function getTemperatureRecords(data) {
  return callFunction("getTemperatureRecords", data);
}
function addMedicineRecord(data) {
  return callFunction("addMedicineRecord", data, { showLoading: true, loadingText: "记录中..." });
}
function getMedicineRecords(data) {
  return callFunction("getMedicineRecords", data);
}
function addSymptomRecord(data) {
  return callFunction("addSymptomRecord", data, { showLoading: true, loadingText: "记录中..." });
}
function getSymptomRecords(data) {
  return callFunction("getSymptomRecords", data);
}
function getHealthOverview(childId) {
  return callFunction("getHealthOverview", { childId });
}
exports.addChild = addChild;
exports.addMedicineRecord = addMedicineRecord;
exports.addSymptomRecord = addSymptomRecord;
exports.addTemperature = addTemperature;
exports.deleteChild = deleteChild;
exports.getChildren = getChildren;
exports.getHealthOverview = getHealthOverview;
exports.getMedicineRecords = getMedicineRecords;
exports.getSymptomRecords = getSymptomRecords;
exports.getTemperatureRecords = getTemperatureRecords;
exports.updateChild = updateChild;
exports.userLogin = userLogin;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/api/index.js.map
