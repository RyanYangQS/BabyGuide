"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_health = require("../../src/store/modules/health.js");
const src_utils_date = require("../../src/utils/date.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const healthStore = src_store_modules_health.useHealthStore();
    const medicineRecords = common_vendor.computed(() => healthStore.medicineRecords);
    const todayMedicineCount = common_vendor.computed(() => healthStore.todayMedicineRecords.length);
    const nextMedicineTime = common_vendor.ref("");
    const medicineReminders = common_vendor.ref([
      { id: "1", name: "美林", time: "14:00" },
      { id: "2", name: "小儿氨酚黄那敏颗粒", time: "18:00" }
    ]);
    function handleTakeMedicine(reminder) {
      common_vendor.index.showModal({
        title: "确认服用",
        content: `确认已服用 ${reminder.name}？`,
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "已记录",
              icon: "success"
            });
          }
        }
      });
    }
    function handleAdd() {
      common_vendor.index.showToast({
        title: "添加用药记录",
        icon: "none"
      });
    }
    common_vendor.onMounted(() => {
      if (medicineRecords.value.length === 0) {
        const mockRecords = [
          {
            _id: "1",
            childId: "1",
            medicineId: "1",
            medicineName: "美林",
            dosage: "5",
            unit: "ml",
            takeTime: (/* @__PURE__ */ new Date()).toISOString(),
            createTime: (/* @__PURE__ */ new Date()).toISOString()
          },
          {
            _id: "2",
            childId: "1",
            medicineId: "3",
            medicineName: "小儿氨酚黄那敏颗粒",
            dosage: "1",
            unit: "袋",
            takeTime: new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString(),
            createTime: new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString()
          }
        ];
        healthStore.setMedicineRecords(mockRecords);
      }
      nextMedicineTime.value = "14:00";
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(todayMedicineCount.value),
        b: nextMedicineTime.value
      }, nextMedicineTime.value ? {
        c: common_vendor.t(nextMedicineTime.value)
      } : {}, {
        d: medicineReminders.value.length > 0
      }, medicineReminders.value.length > 0 ? {
        e: common_vendor.t(medicineReminders.value.length),
        f: common_vendor.f(medicineReminders.value, (reminder, k0, i0) => {
          return {
            a: common_vendor.t(reminder.name),
            b: common_vendor.t(reminder.time),
            c: common_vendor.o(($event) => handleTakeMedicine(reminder), reminder.id),
            d: reminder.id
          };
        })
      } : {}, {
        g: common_vendor.t(medicineRecords.value.length),
        h: medicineRecords.value.length > 0
      }, medicineRecords.value.length > 0 ? {
        i: common_vendor.f(medicineRecords.value, (record, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(record.medicineName),
            b: common_vendor.t(common_vendor.unref(src_utils_date.formatDate)(record.takeTime, "MM-DD HH:mm")),
            c: common_vendor.t(record.dosage),
            d: common_vendor.t(record.unit),
            e: record.notes
          }, record.notes ? {
            f: common_vendor.t(record.notes)
          } : {}, {
            g: record._id
          });
        })
      } : {}, {
        j: common_vendor.o(handleAdd)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-837e70fa"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/medicine/index.js.map
