"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_health = require("../../src/store/modules/health.js");
const src_store_modules_children = require("../../src/store/modules/children.js");
const src_store_modules_user = require("../../src/store/modules/user.js");
const src_utils_date = require("../../src/utils/date.js");
if (!Math) {
  MedicineModal();
}
const MedicineModal = () => "../../src/components/MedicineModal.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "index",
  setup(__props) {
    const healthStore = src_store_modules_health.useHealthStore();
    const childrenStore = src_store_modules_children.useChildrenStore();
    const userStore = src_store_modules_user.useUserStore();
    const showAddModal = common_vendor.ref(false);
    const nextAvailableTime = common_vendor.ref("--:--");
    const countdown = common_vendor.ref("");
    const isLoggedIn = common_vendor.computed(() => userStore.isLoggedIn);
    const currentChild = common_vendor.computed(() => childrenStore.currentChild);
    const medicineRecords = common_vendor.computed(() => healthStore.medicineRecords);
    const todayStats = common_vendor.computed(() => {
      const todayRecords = healthStore.todayMedicineRecords;
      const stats = {};
      todayRecords.forEach((record) => {
        if (!stats[record.medicineName]) {
          stats[record.medicineName] = { current: 0, max: 4 };
        }
        stats[record.medicineName].current++;
      });
      return Object.entries(stats).map(([name, data]) => ({
        name,
        ...data
      }));
    });
    function handleRecordSuccess() {
      var _a;
      if ((_a = currentChild.value) == null ? void 0 : _a._id) {
        healthStore.fetchMedicineRecords(currentChild.value._id);
      }
      updateNextAvailableTime();
    }
    function updateNextAvailableTime() {
      const records = medicineRecords.value;
      if (records.length > 0) {
        const latest = records[0];
        const takeTime = new Date(latest.takeTime);
        const nextTime = new Date(takeTime.getTime() + 4 * 60 * 60 * 1e3);
        nextAvailableTime.value = src_utils_date.formatDate(nextTime, "HH:mm");
        const now = /* @__PURE__ */ new Date();
        if (nextTime > now) {
          const diff = nextTime.getTime() - now.getTime();
          const hours = Math.floor(diff / (1e3 * 60 * 60));
          const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
          countdown.value = `(还剩${hours}小时${minutes}分钟)`;
        } else {
          countdown.value = "";
          nextAvailableTime.value = "现在可用";
        }
      }
    }
    common_vendor.watch(currentChild, (child) => {
      if (child && child._id) {
        healthStore.fetchMedicineRecords(child._id);
      }
    }, { immediate: true });
    common_vendor.watch(medicineRecords, () => {
      updateNextAvailableTime();
    }, { deep: true });
    common_vendor.onMounted(() => {
      userStore.checkLoginStatus();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isLoggedIn.value
      }, !isLoggedIn.value ? {} : !currentChild.value ? {} : common_vendor.e({
        c: common_vendor.t(nextAvailableTime.value),
        d: countdown.value
      }, countdown.value ? {
        e: common_vendor.t(countdown.value)
      } : {}, {
        f: common_vendor.f(todayStats.value, (stat, k0, i0) => {
          return {
            a: common_vendor.t(stat.name),
            b: common_vendor.t(stat.current),
            c: common_vendor.t(stat.max),
            d: stat.name
          };
        }),
        g: medicineRecords.value.length > 0
      }, medicineRecords.value.length > 0 ? {
        h: common_vendor.f(medicineRecords.value, (record, k0, i0) => {
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
        i: common_vendor.o(($event) => showAddModal.value = true),
        j: common_vendor.o(handleRecordSuccess),
        k: common_vendor.o(($event) => showAddModal.value = $event),
        l: common_vendor.p({
          show: showAddModal.value
        })
      }), {
        b: !currentChild.value
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-837e70fa"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/medicine/index.js.map
