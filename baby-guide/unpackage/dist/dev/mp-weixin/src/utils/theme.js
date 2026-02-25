"use strict";
const common_vendor = require("../../common/vendor.js");
var HealthStatus = /* @__PURE__ */ ((HealthStatus2) => {
  HealthStatus2["Healthy"] = "healthy";
  HealthStatus2["LowFever"] = "low-fever";
  HealthStatus2["Fever"] = "fever";
  return HealthStatus2;
})(HealthStatus || {});
common_vendor.ref(
  "healthy"
  /* Healthy */
);
function getHealthStatus(temperature) {
  if (temperature >= 38.5) {
    return "fever";
  }
  if (temperature >= 37.3) {
    return "low-fever";
  }
  return "healthy";
}
exports.HealthStatus = HealthStatus;
exports.getHealthStatus = getHealthStatus;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/utils/theme.js.map
