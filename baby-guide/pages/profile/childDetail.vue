<template>
  <view class="child-detail-page">
    <!-- 儿童信息 -->
    <view class="child-header card">
      <image class="child-avatar" :src="childInfo?.avatar || defaultAvatar" mode="aspectFill" />
      <view class="child-info">
        <text class="child-name">{{ childInfo?.name }}</text>
        <text class="child-meta">{{ formatAge(childInfo?.birthday || '') }} · {{ childInfo?.gender === 'male' ? '男' : '女' }}</text>
      </view>
      <text class="edit-btn" @click="handleEdit">编辑</text>
    </view>

    <!-- 基本信息 -->
    <view class="info-section card">
      <view class="section-title">基本信息</view>
      <view class="info-item">
        <text class="info-label">生日</text>
        <text class="info-value">{{ childInfo?.birthday || '--' }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">血型</text>
        <text class="info-value">{{ childInfo?.bloodType || '--' }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">过敏史</text>
        <text class="info-value">{{ childInfo?.allergies?.join('、') || '无' }}</text>
      </view>
      <view class="info-item" v-if="childInfo?.notes">
        <text class="info-label">备注</text>
        <text class="info-value">{{ childInfo?.notes }}</text>
      </view>
    </view>

    <!-- 健康统计 -->
    <view class="stats-section card">
      <view class="section-title">健康统计</view>
      <view class="stats-grid">
        <view class="stats-item">
          <text class="stats-value">{{ stats.temperatureCount }}</text>
          <text class="stats-label">体温记录</text>
        </view>
        <view class="stats-item">
          <text class="stats-value">{{ stats.medicineCount }}</text>
          <text class="stats-label">用药记录</text>
        </view>
        <view class="stats-item">
          <text class="stats-value">{{ stats.symptomCount }}</text>
          <text class="stats-label">症状记录</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-section">
      <button class="btn-delete" @click="handleDelete">删除档案</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChildrenStore } from '../../src/store/modules/children'
import { useHealthStore } from '../../src/store/modules/health'
import { formatAge } from '../../src/utils/date'

const childrenStore = useChildrenStore()
const healthStore = useHealthStore()

const defaultAvatar = '/static/logo.png'

// 儿童信息
const childInfo = computed(() => childrenStore.currentChild)

// 统计数据
const stats = computed(() => ({
  temperatureCount: healthStore.temperatureRecords.filter(r => r.childId === childInfo.value?._id).length,
  medicineCount: healthStore.medicineRecords.filter(r => r.childId === childInfo.value?._id).length,
  symptomCount: healthStore.symptomRecords.filter(r => r.childId === childInfo.value?._id).length
}))

/**
 * 编辑儿童信息
 */
function handleEdit() {
  uni.navigateTo({
    url: '/pages/profile/addChild'
  })
}

/**
 * 删除儿童档案
 */
function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: '删除后将无法恢复，确定要删除吗？',
    confirmColor: '#FF4D4F',
    success: (res) => {
      if (res.confirm) {
        if (childInfo.value) {
          childrenStore.removeChild(childInfo.value._id)
        }
        
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@import '../../src/styles/variables.scss';

.child-detail-page {
  min-height: 100vh;
  padding: $spacing-md;
}

// 儿童头部
.child-header {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-lg;
  
  .child-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-right: $spacing-md;
  }
  
  .child-info {
    flex: 1;
  }
  
  .child-name {
    font-size: $font-xl;
    font-weight: bold;
    color: $text-color;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .child-meta {
    font-size: $font-sm;
    color: $text-secondary;
  }
  
  .edit-btn {
    font-size: $font-md;
    color: $primary-color;
    padding: 8rpx 24rpx;
    border: 2rpx solid $primary-color;
    border-radius: $radius-full;
  }
}

// 信息区域
.info-section {
  margin-bottom: $spacing-lg;
  
  .section-title {
    font-size: $font-lg;
    font-weight: bold;
    color: $text-color;
    margin-bottom: $spacing-md;
  }
  
  .info-item {
    display: flex;
    padding: $spacing-sm 0;
    border-bottom: 1rpx solid $border-color;
    
    &:last-child {
      border-bottom: none;
    }
    
    .info-label {
      width: 160rpx;
      font-size: $font-md;
      color: $text-secondary;
    }
    
    .info-value {
      flex: 1;
      font-size: $font-md;
      color: $text-color;
    }
  }
}

// 统计区域
.stats-section {
  margin-bottom: $spacing-lg;
  
  .section-title {
    font-size: $font-lg;
    font-weight: bold;
    color: $text-color;
    margin-bottom: $spacing-md;
  }
  
  .stats-grid {
    display: flex;
    
    .stats-item {
      flex: 1;
      text-align: center;
      padding: $spacing-md;
      
      .stats-value {
        font-size: 48rpx;
        font-weight: bold;
        color: $primary-color;
        display: block;
        margin-bottom: 8rpx;
      }
      
      .stats-label {
        font-size: $font-sm;
        color: $text-secondary;
      }
    }
  }
}

// 操作区域
.action-section {
  padding: $spacing-lg;
  
  .btn-delete {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background-color: #FFFFFF;
    color: $error-color;
    font-size: $font-md;
    border-radius: $radius-full;
    border: 2rpx solid $error-color;
  }
}
</style>
