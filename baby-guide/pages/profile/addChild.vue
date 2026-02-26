<template>
  <view class="add-child-page">
    <view class="form-section card">
      <!-- 头像 -->
      <view class="form-item avatar-item" @click="handleChooseAvatar">
        <text class="form-label">头像</text>
        <view class="avatar-wrapper">
          <image class="avatar" :src="formData.avatar || defaultAvatar" mode="aspectFill" />
          <text class="avatar-tip">点击更换</text>
        </view>
      </view>
      
      <!-- 姓名 -->
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input 
          class="form-input" 
          v-model="formData.name"
          placeholder="请输入姓名"
          placeholder-class="input-placeholder"
        />
      </view>
      
      <!-- 性别 -->
      <view class="form-item">
        <text class="form-label">性别</text>
        <view class="gender-options">
          <view 
            class="gender-option" 
            :class="{ active: formData.gender === 'male' }"
            @click="formData.gender = 'male'"
          >
            <text class="gender-icon">👦</text>
            <text class="gender-text">男</text>
          </view>
          <view 
            class="gender-option" 
            :class="{ active: formData.gender === 'female' }"
            @click="formData.gender = 'female'"
          >
            <text class="gender-icon">👧</text>
            <text class="gender-text">女</text>
          </view>
        </view>
      </view>
      
      <!-- 生日 -->
      <view class="form-item">
        <text class="form-label">生日</text>
        <picker mode="date" :value="formData.birthday" @change="handleBirthdayChange">
          <view class="form-picker">
            <text class="picker-text" v-if="formData.birthday">{{ formData.birthday }}</text>
            <text class="picker-placeholder" v-else>请选择生日</text>
            <text class="picker-arrow">›</text>
          </view>
        </picker>
      </view>
      
      <!-- 血型 -->
      <view class="form-item">
        <text class="form-label">血型</text>
        <picker mode="selector" :range="bloodTypes" @change="handleBloodTypeChange">
          <view class="form-picker">
            <text class="picker-text" v-if="formData.bloodType">{{ formData.bloodType }}</text>
            <text class="picker-placeholder" v-else>请选择血型</text>
            <text class="picker-arrow">›</text>
          </view>
        </picker>
      </view>
      
      <!-- 过敏史 -->
      <view class="form-item">
        <text class="form-label">过敏史</text>
        <textarea 
          class="form-textarea" 
          v-model="formData.allergies"
          placeholder="请输入过敏史，多个用逗号分隔"
          placeholder-class="input-placeholder"
          :maxlength="200"
        />
      </view>
      
      <!-- 备注 -->
      <view class="form-item">
        <text class="form-label">备注</text>
        <textarea 
          class="form-textarea" 
          v-model="formData.notes"
          placeholder="请输入备注信息"
          placeholder-class="input-placeholder"
          :maxlength="500"
        />
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="btn-submit" @click="handleSubmit">保存</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChildrenStore } from '../../src/store/modules/children'

const childrenStore = useChildrenStore()

const defaultAvatar = '/static/logo.png'

// 血型选项
const bloodTypes = ['A型', 'B型', 'AB型', 'O型']

// 表单数据
const formData = ref({
  avatar: '',
  name: '',
  gender: 'male' as 'male' | 'female',
  birthday: '',
  bloodType: '',
  allergies: '',
  notes: ''
})

// 提交状态
const submitting = ref(false)

/**
 * 选择头像
 */
function handleChooseAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      formData.value.avatar = res.tempFilePaths[0]
    }
  })
}

/**
 * 生日选择变化
 */
function handleBirthdayChange(e: any) {
  formData.value.birthday = e.detail.value
}

/**
 * 血型选择变化
 */
function handleBloodTypeChange(e: any) {
  formData.value.bloodType = bloodTypes[e.detail.value]
}

/**
 * 提交表单
 */
async function handleSubmit() {
  // 验证表单
  if (!formData.value.name) {
    uni.showToast({
      title: '请输入姓名',
      icon: 'none'
    })
    return
  }
  
  if (!formData.value.birthday) {
    uni.showToast({
      title: '请选择生日',
      icon: 'none'
    })
    return
  }

  submitting.value = true
  
  // 调用 API 保存
  const res = await childrenStore.addChildApi({
    name: formData.value.name,
    gender: formData.value.gender,
    birthday: formData.value.birthday,
    bloodType: formData.value.bloodType,
    allergies: formData.value.allergies.split(',').filter(Boolean),
    notes: formData.value.notes
  })
  
  submitting.value = false
  
  if (res.success) {
    uni.showToast({
      title: '保存成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
}
</script>

<style lang="scss" scoped>
@import '../../src/styles/variables.scss';

.add-child-page {
  min-height: 100vh;
  padding: $spacing-md;
  padding-bottom: 200rpx;
}

.form-section {
  margin-bottom: $spacing-lg;
  
  .form-item {
    padding: $spacing-md 0;
    border-bottom: 1rpx solid $border-color;
    
    &:last-child {
      border-bottom: none;
    }
    
    .form-label {
      font-size: $font-md;
      color: $text-color;
      margin-bottom: $spacing-sm;
      display: block;
    }
    
    .form-input {
      width: 100%;
      height: 80rpx;
      background-color: $background-color;
      border-radius: $radius-md;
      padding: 0 $spacing-md;
      font-size: $font-md;
      color: $text-color;
    }
    
    .form-textarea {
      width: 100%;
      height: 160rpx;
      background-color: $background-color;
      border-radius: $radius-md;
      padding: $spacing-sm $spacing-md;
      font-size: $font-md;
      color: $text-color;
    }
    
    .form-picker {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80rpx;
      background-color: $background-color;
      border-radius: $radius-md;
      padding: 0 $spacing-md;
      
      .picker-text {
        font-size: $font-md;
        color: $text-color;
      }
      
      .picker-placeholder {
        font-size: $font-md;
        color: $text-light;
      }
      
      .picker-arrow {
        font-size: $font-xl;
        color: $text-light;
      }
    }
  }
  
  .avatar-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .avatar-wrapper {
      display: flex;
      align-items: center;
    }
    
    .avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
      margin-right: $spacing-sm;
    }
    
    .avatar-tip {
      font-size: $font-sm;
      color: $primary-color;
    }
  }
  
  .gender-options {
    display: flex;
    gap: $spacing-md;
    
    .gender-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: $spacing-md;
      background-color: $background-color;
      border-radius: $radius-md;
      border: 2rpx solid transparent;
      
      &.active {
        background-color: rgba($primary-color, 0.1);
        border-color: $primary-color;
      }
      
      .gender-icon {
        font-size: 48rpx;
        margin-bottom: 8rpx;
      }
      
      .gender-text {
        font-size: $font-sm;
        color: $text-color;
      }
    }
  }
}

.input-placeholder {
  color: $text-light;
}

.submit-section {
  padding: $spacing-lg;
  
  .btn-submit {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background-color: $primary-color;
    color: #FFFFFF;
    font-size: $font-lg;
    border-radius: $radius-full;
    border: none;
  }
}
</style>
