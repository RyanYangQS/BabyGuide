"use strict";
const common_vendor = require("../../common/vendor.js");
const src_store_modules_children = require("../../src/store/modules/children.js");
const defaultAvatar = "/static/logo.png";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "addChild",
  setup(__props) {
    const childrenStore = src_store_modules_children.useChildrenStore();
    const bloodTypes = ["A型", "B型", "AB型", "O型"];
    const formData = common_vendor.ref({
      avatar: "",
      name: "",
      gender: "male",
      birthday: "",
      bloodType: "",
      allergies: "",
      notes: ""
    });
    function handleChooseAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          formData.value.avatar = res.tempFilePaths[0];
        }
      });
    }
    function handleBirthdayChange(e) {
      formData.value.birthday = e.detail.value;
    }
    function handleBloodTypeChange(e) {
      formData.value.bloodType = bloodTypes[e.detail.value];
    }
    function handleSubmit() {
      if (!formData.value.name) {
        common_vendor.index.showToast({
          title: "请输入姓名",
          icon: "none"
        });
        return;
      }
      if (!formData.value.birthday) {
        common_vendor.index.showToast({
          title: "请选择生日",
          icon: "none"
        });
        return;
      }
      const child = {
        _id: Date.now().toString(),
        name: formData.value.name,
        avatar: formData.value.avatar,
        gender: formData.value.gender,
        birthday: formData.value.birthday,
        bloodType: formData.value.bloodType,
        allergies: formData.value.allergies.split(",").filter(Boolean),
        notes: formData.value.notes,
        createTime: (/* @__PURE__ */ new Date()).toISOString(),
        updateTime: (/* @__PURE__ */ new Date()).toISOString()
      };
      childrenStore.addChild(child);
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    }
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: formData.value.avatar || defaultAvatar,
        b: common_vendor.o(handleChooseAvatar),
        c: formData.value.name,
        d: common_vendor.o(($event) => formData.value.name = $event.detail.value),
        e: formData.value.gender === "male" ? 1 : "",
        f: common_vendor.o(($event) => formData.value.gender = "male"),
        g: formData.value.gender === "female" ? 1 : "",
        h: common_vendor.o(($event) => formData.value.gender = "female"),
        i: formData.value.birthday
      }, formData.value.birthday ? {
        j: common_vendor.t(formData.value.birthday)
      } : {}, {
        k: formData.value.birthday,
        l: common_vendor.o(handleBirthdayChange),
        m: formData.value.bloodType
      }, formData.value.bloodType ? {
        n: common_vendor.t(formData.value.bloodType)
      } : {}, {
        o: bloodTypes,
        p: common_vendor.o(handleBloodTypeChange),
        q: formData.value.allergies,
        r: common_vendor.o(($event) => formData.value.allergies = $event.detail.value),
        s: formData.value.notes,
        t: common_vendor.o(($event) => formData.value.notes = $event.detail.value),
        v: common_vendor.o(handleSubmit)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-86071d57"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/addChild.js.map
