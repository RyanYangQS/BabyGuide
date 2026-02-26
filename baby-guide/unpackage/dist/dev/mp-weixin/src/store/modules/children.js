"use strict";
const common_vendor = require("../../../common/vendor.js");
const src_api_index = require("../../api/index.js");
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
  async function fetchChildren() {
    loading.value = true;
    const res = await src_api_index.getChildren();
    loading.value = false;
    if (res.success && res.data) {
      childrenList.value = res.data;
      restoreCurrentChild();
    }
    return res;
  }
  async function addChildApi(data) {
    const res = await src_api_index.addChild(data);
    if (res.success && res.data) {
      childrenList.value.push(res.data);
      if (!currentChild.value) {
        setCurrentChild(res.data);
      }
    }
    return res;
  }
  function addChild(child) {
    childrenList.value.push(child);
  }
  async function updateChildApi(data) {
    var _a;
    const res = await src_api_index.updateChild(data);
    if (res.success) {
      const index = childrenList.value.findIndex((c) => c._id === data.childId);
      if (index !== -1) {
        Object.assign(childrenList.value[index], data);
        if (((_a = currentChild.value) == null ? void 0 : _a._id) === data.childId) {
          Object.assign(currentChild.value, data);
        }
      }
    }
    return res;
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
  async function deleteChildApi(childId) {
    var _a;
    const res = await src_api_index.deleteChild(childId);
    if (res.success) {
      childrenList.value = childrenList.value.filter((c) => c._id !== childId);
      if (((_a = currentChild.value) == null ? void 0 : _a._id) === childId) {
        currentChild.value = childrenList.value[0] || null;
        if (currentChild.value) {
          common_vendor.index.setStorageSync("currentChildId", currentChild.value._id);
        }
      }
    }
    return res;
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
    fetchChildren,
    addChildApi,
    addChild,
    updateChildApi,
    updateChild,
    deleteChildApi,
    removeChild,
    restoreCurrentChild
  };
});
exports.useChildrenStore = useChildrenStore;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/src/store/modules/children.js.map
