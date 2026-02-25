"use strict";
const common_vendor = require("../../common/vendor.js");
common_vendor.dayjs.extend(common_vendor.relativeTime);
common_vendor.dayjs.locale("zh-cn");
function formatDate(date, format = "YYYY-MM-DD HH:mm") {
  return common_vendor.dayjs(date).format(format);
}
function calculateAge(birthday) {
  const birth = common_vendor.dayjs(birthday);
  const now = common_vendor.dayjs();
  let years = now.year() - birth.year();
  let months = now.month() - birth.month();
  let days = now.date() - birth.date();
  if (days < 0) {
    months--;
    days += common_vendor.dayjs(now).subtract(1, "month").daysInMonth();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}
function formatAge(birthday) {
  const { years, months } = calculateAge(birthday);
  if (years === 0) {
    return `${months}个月`;
  }
  if (months === 0) {
    return `${years}岁`;
  }
  return `${years}岁${months}个月`;
}
exports.formatAge = formatAge;
exports.formatDate = formatDate;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/utils/date.js.map
