"use strict";
const common_vendor = require("../../../common/vendor.js");
const src_api_index = require("../../api/index.js");
const useUserStore = common_vendor.defineStore("user", () => {
  const isLoggedIn = common_vendor.ref(false);
  const userInfo = common_vendor.ref(null);
  const loading = common_vendor.ref(false);
  async function login() {
    loading.value = true;
    try {
      const res = await src_api_index.userLogin();
      if (res.success && res.data) {
        isLoggedIn.value = true;
        userInfo.value = {
          userId: res.data.userId,
          openid: res.data.openid,
          isNewUser: res.data.isNewUser
        };
        common_vendor.index.setStorageSync("isLoggedIn", true);
        common_vendor.index.setStorageSync("userId", res.data.userId);
        return { success: true, isNewUser: res.data.isNewUser };
      } else {
        return { success: false, errMsg: res.errMsg };
      }
    } catch (err) {
      common_vendor.index.__f__("error", "at src/store/modules/user.ts:44", "登录失败:", err);
      return { success: false, errMsg: err.message || "登录失败" };
    } finally {
      loading.value = false;
    }
  }
  function updateUserInfo(nickName, avatarUrl) {
    if (userInfo.value) {
      userInfo.value.nickName = nickName;
      userInfo.value.avatarUrl = avatarUrl;
      common_vendor.index.setStorageSync("userNickName", nickName);
      common_vendor.index.setStorageSync("userAvatarUrl", avatarUrl);
    }
  }
  function checkLoginStatus() {
    const loggedIn = common_vendor.index.getStorageSync("isLoggedIn");
    const userId = common_vendor.index.getStorageSync("userId");
    const nickName = common_vendor.index.getStorageSync("userNickName");
    const avatarUrl = common_vendor.index.getStorageSync("userAvatarUrl");
    if (loggedIn && userId) {
      isLoggedIn.value = true;
      userInfo.value = {
        userId,
        openid: "",
        nickName,
        avatarUrl
      };
      return true;
    }
    return false;
  }
  function logout() {
    isLoggedIn.value = false;
    userInfo.value = null;
    common_vendor.index.removeStorageSync("isLoggedIn");
    common_vendor.index.removeStorageSync("userId");
    common_vendor.index.removeStorageSync("userNickName");
    common_vendor.index.removeStorageSync("userAvatarUrl");
  }
  return {
    isLoggedIn,
    userInfo,
    loading,
    login,
    updateUserInfo,
    checkLoginStatus,
    logout
  };
});
exports.useUserStore = useUserStore;
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/src/store/modules/user.js.map
