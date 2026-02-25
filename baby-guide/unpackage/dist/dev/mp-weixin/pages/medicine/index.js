"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_health = require("../../src/store/modules/health.js");
const src_utils_date = require("../../src/utils/date.js");
if (!Math) {
  MedicineModal();
}
const MedicineModal = () => "../../src/components/MedicineModal.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const healthStore = src_store_modules_health.useHealthStore();
    const showAddModal = common_vendor.ref(false);
    const nextAvailableTime = common_vendor.ref("--:--");
    const countdown = common_vendor.ref("");
    const medicineRecords = common_vendor.computed(() => healthStore.medicineRecords);
    const todayStats = common_vendor.computed(() => {
      return [
        { name: "美林", current: 2, max: 4 },
        { name: "泰诺林", current: 1, max: 4 }
      ];
    });
    function handleRecordSuccess() {
      updateNextAvailableTime();
    }
    function updateNextAvailableTime() {
      const now = /* @__PURE__ */ new Date();
      const next = new Date(now.getTime() + 4 * 60 * 60 * 1e3);
      nextAvailableTime.value = src_utils_date.formatDate(next, "HH:mm");
      const diff = next.getTime() - now.getTime();
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      countdown.value = `(还剩${hours}小时${minutes}分钟)`;
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
            takeTime: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString(),
            nextTakeTime: new Date(Date.now() + 2 * 60 * 60 * 1e3).toISOString(),
            createTime: new Date(Date.now() - 2 * 60 * 60 * 1e3).toISOString()
          },
          {
            _id: "2",
            childId: "1",
            medicineId: "2",
            medicineName: "泰诺林",
            dosage: "3",
            unit: "ml",
            takeTime: new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString(),
            createTime: new Date(Date.now() - 6 * 60 * 60 * 1e3).toISOString()
          }
        ];
        healthStore.setMedicineRecords(mockRecords);
      }
      updateNextAvailableTime();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(nextAvailableTime.value),
        b: countdown.value
      }, countdown.value ? {
        c: common_vendor.t(countdown.value)
      } : {}, {
        d: common_vendor.f(todayStats.value, (stat, k0, i0) => {
          return {
            a: common_vendor.t(stat.name),
            b: common_vendor.t(stat.current),
            c: common_vendor.t(stat.max),
            d: stat.name
          };
        }),
        e: medicineRecords.value.length > 0
      }, medicineRecords.value.length > 0 ? {
        f: common_vendor.f(medicineRecords.value, (record, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(record.medicineName),
            b: common_vendor.t(record.dosage),
            c: common_vendor.t(record.unit),
            d: common_vendor.t(common_vendor.unref(src_utils_date.formatDate)(record.takeTime, "MM-DD HH:mm")),
            e: record.nextTakeTime
          }, record.nextTakeTime ? {
            f: common_vendor.t(common_vendor.unref(src_utils_date.formatDate)(record.nextTakeTime, "HH:mm"))
          } : {}, {
            g: record.notes
          }, record.notes ? {
            h: common_vendor.t(record.notes)
          } : {}, {
            i: record._id
          });
        })
      } : {}, {
        g: common_vendor.o(($event) => showAddModal.value = true),
        h: common_vendor.o(handleRecordSuccess),
        i: common_vendor.o(($event) => showAddModal.value = $event),
        j: common_vendor.p({
          show: showAddModal.value
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-837e70fa"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/medicine/index.js.map
