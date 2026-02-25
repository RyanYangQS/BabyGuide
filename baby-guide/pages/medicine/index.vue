<template>
  <view class="medicine-page">
    <!-- 今日用药概览 -->
    <view class="medicine-overview card">
      <view class="overview-header">
        <text class="overview-title">今日用药</text>
        <text class="overview-count">{{ todayMedicineCount }}次</text>
      </view>
      <view class="overview-tips" v-if="nextMedicineTime">
        <text class="tips-icon">⏰</text>
        <text class="tips-text">下次用药时间：{{ nextMedicineTime }}</text>
      </view>
    </view>

    <!-- 用药提醒 -->
    <view class="reminder-section card" v-if="medicineReminders.length > 0">
      <view class="section-title">
        <text class="title-text">用药提醒</text>
        <text class="title-badge">{{ medicineReminders.length }}</text>
      </view>
      <view class="reminder-list">
        <view 
          class="reminder-item" 
          v-for="reminder in medicineReminders" 
          :key="reminder.id"
        >
          <view class="reminder-info">
            <text class="reminder-name">{{ reminder.name }}</text>
            <text class="reminder-time">{{ reminder.time }}</text>
          </view>
          <view class="reminder-action">
            <button class="btn-take" @click="handleTakeMedicine(reminder)">服用</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 用药记录列表 -->
    <view class="record-section">
      <view class="section-header">
        <text class="section-title">用药记录</text>
        <text class="record-count">共{{ medicineRecords.length }}条</text>
      </view>
      
      <view class="record-list" v-if="medicineRecords.length > 0">
        <view 
          class="record-item card" 
          v-for="record in medicineRecords" 
          :key="record._id"
        >
          <view class="record-header">
            <text class="record-name">{{ record.medicineName }}</text>
            <text class="record-time">{{ formatDate(record.takeTime, 'MM-DD HH:mm') }}</text>
          </view>
          <view class="record-detail">
            <view class="detail-item">
              <text class="detail-label">剂量：</text>
              <text class="detail-value">{{ record.dosage }}{{ record.unit }}</text>
            </view>
            <view class="detail-item" v-if="record.notes">
              <text class="detail-label">备注：</text>
              <text class="detail-value">{{ record.notes }}</text>
            </view>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <text class="empty-icon">💊</text>
        <text class="empty-text">暂无用药记录</text>
      </view>
    </view>

    <!-- 添加按钮 -->
    <view class="add-btn" @click="handleAdd">
      <text class="add-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHealthStore } from '../../src/store/modules/health'
import { formatDate } from '../../src/utils/date'

const healthStore = useHealthStore()

// 用药记录列表
const medicineRecords = computed(() => healthStore.medicineRecords)

// 今日用药次数
const todayMedicineCount = computed(() => healthStore.todayMedicineRecords.length)

// 下次用药时间（模拟）
const nextMedicineTime = ref('')

// 用药提醒列表（模拟）
const medicineReminders = ref([
  { id: '1', name: '美林', time: '14:00' },
  { id: '2', name: '小儿氨酚黄那敏颗粒', time: '18:00' }
])

/**
 * 服用药物
 */
function handleTakeMedicine(reminder: any) {
  uni.showModal({
    title: '确认服用',
    content: `确认已服用 ${reminder.name}？`,
    success: (res) => {
      if (res.confirm) {
        // TODO: 记录用药
        uni.showToast({
          title: '已记录',
          icon: 'success'
        })
      }
    }
  })
}

/**
 * 添加用药记录
 */
function handleAdd() {
  // TODO: 跳转到添加页面或显示弹窗
  uni.showToast({
    title: '添加用药记录',
    icon: 'none'
  })
}

onMounted(() => {
  // 加载模拟数据
  if (medicineRecords.value.length === 0) {
    const mockRecords = [
      {
        _id: '1',
        childId: '1',
        medicineId: '1',
        medicineName: '美林',
        dosage: '5',
        unit: 'ml',
        takeTime: new Date().toISOString(),
        createTime: new Date().toISOString()
      },
      {
        _id: '2',
        childId: '1',
        medicineId: '3',
        medicineName: '小儿氨酚黄那敏颗粒',
        dosage: '1',
        unit: '袋',
        takeTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        createTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ]
    healthStore.setMedicineRecords(mockRecords)
  }
  
  // 设置下次用药时间
  nextMedicineTime.value = '14:00'
})
</script>

<style lang="scss" scoped>
@import '../../src/styles/variables.scss';

.medicine-page {
  min-height: 100vh;
  padding: $spacing-md;
  padding-bottom: 200rpx;
}

// 用药概览
.medicine-overview {
  margin-bottom: $spacing-lg;
  
  .overview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;
  }
  
  .overview-title {
    font-size: $font-lg;
    font-weight: bold;
    color: $text-color;
  }
  
  .overview-count {
    font-size: $font-xl;
    font-weight: bold;
    color: $primary-color;
  }
  
  .overview-tips {
    display: flex;
    align-items: center;
    padding: $spacing-sm;
    background-color: rgba($warning-color, 0.1);
    border-radius: $radius-md;
    
    .tips-icon {
      font-size: $font-lg;
      margin-right: $spacing-sm;
    }
    
    .tips-text {
      font-size: $font-sm;
      color: $warning-color;
    }
  }
}

// 用药提醒
.reminder-section {
  margin-bottom: $spacing-lg;
  
  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-md;
    
    .title-text {
      font-size: $font-md;
      font-weight: bold;
      color: $text-color;
    }
    
    .title-badge {
      margin-left: $spacing-sm;
      padding: 2rpx 12rpx;
      background-color: $error-color;
      color: #FFFFFF;
      font-size: $font-xs;
      border-radius: $radius-full;
    }
  }
  
  .reminder-list {
    .reminder-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: $spacing-sm 0;
      border-bottom: 1rpx solid $border-color;
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    .reminder-info {
      flex: 1;
      
      .reminder-name {
        font-size: $font-md;
        color: $text-color;
        display: block;
        margin-bottom: 4rpx;
      }
      
      .reminder-time {
        font-size: $font-sm;
        color: $text-light;
      }
    }
    
    .btn-take {
      padding: 8rpx 32rpx;
      background-color: $primary-color;
      color: #FFFFFF;
      font-size: $font-sm;
      border-radius: $radius-full;
      border: none;
    }
  }
}

// 记录列表
.record-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
  }
  
  .section-title {
    font-size: $font-lg;
    font-weight: bold;
    color: $text-color;
  }
  
  .record-count {
    font-size: $font-sm;
    color: $text-light;
  }
  
  .record-list {
    .record-item {
      margin-bottom: $spacing-md;
    }
    
    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-sm;
      
      .record-name {
        font-size: $font-lg;
        font-weight: bold;
        color: $text-color;
      }
      
      .record-time {
        font-size: $font-sm;
        color: $text-light;
      }
    }
    
    .record-detail {
      .detail-item {
        display: flex;
        margin-bottom: 4rpx;
        
        .detail-label {
          font-size: $font-sm;
          color: $text-secondary;
        }
        
        .detail-value {
          font-size: $font-sm;
          color: $text-color;
        }
      }
    }
  }
}

// 添加按钮
.add-btn {
  position: fixed;
  right: 40rpx;
  bottom: 200rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-color 0%, #5BA3F5 100%);
  box-shadow: $shadow-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  
  .add-icon {
    font-size: 48rpx;
    color: #FFFFFF;
    font-weight: bold;
  }
}
</style>
