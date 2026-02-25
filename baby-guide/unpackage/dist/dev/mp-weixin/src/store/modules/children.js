"use strict";
const common_vendor = require("../../../common/vendor.js");
const useChildrenStore = common_vendor.defineStore("children", () => {
  const currentChild = common_vendor.ref(null);
  const childrenList = common_vendor.ref([]);
  const loading = common_vendor.ref(false);
  function setCurrentChild(child) {
    currentChild.value = child;
    if (child) {
      common_vendor.index.setStorageSync("currentChildId", child._id);
    } else {
      common_vendor.index.removeStorageSync("currentChildId");
    }
  }
  function setChildrenList(list) {
    childrenList.value = list;
  }
  function addChild(child) {
    childrenList.value.push(child);
  }
  function updateChild(child) {
    var _a;
    const index = childrenList.value.findIndex((c) => c._id === child._id);
    if (index !== -1) {
      childrenList.value[index] = child;
      if (((_a = currentChild.value) == null ? void 0 : _a._id) === child._id) {
        currentChild.value = child;
      }
    }
  }
  function removeChild(childId) {
    var _a;
    childrenList.value = childrenList.value.filter((c) => c._id !== childId);
    if (((_a = currentChild.value) == null ? void 0 : _a._id) === childId) {
      currentChild.value = childrenList.value[0] || null;
    }
  }
  function restoreCurrentChild() {
    const currentChildId = common_vendor.index.getStorageSync("currentChildId");
    if (currentChildId && childrenList.value.length > 0) {
      const child = childrenList.value.find((c) => c._id === currentChildId);
      if (child) {
        currentChild.value = child;
      } else if (childrenList.value.length > 0) {
        currentChild.value = childrenList.value[0];
      }
    } else if (childrenList.value.length > 0) {
      currentChild.value = childrenList.value[0];
    }
  }
  return {
    currentChild,
    childrenList,
    loading,
    setCurrentChild,
    setChildrenList,
    addChild,
    updateChild,
    removeChild,
    restoreCurrentChild
  };
});
exports.useChildrenStore = useChildrenStore;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/src/store/modules/children.js.map
