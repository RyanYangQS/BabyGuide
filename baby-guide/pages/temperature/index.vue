<template>
  <view class="temperature-page">
    <!-- 体温概览 -->
    <view class="temperature-overview card" :class="themeClass">
      <view class="overview-header">
        <text class="overview-title">当前体温</text>
        <text class="overview-status" :class="themeClass">{{ healthStatusText }}</text>
      </view>
      <view class="overview-value">
        <text class="value-number">{{ latestTemperature?.temperature || '--' }}</text>
        <text class="value-unit">°C</text>
      </view>
      <view class="overview-time" v-if="latestTemperature">
        测量时间：{{ formatDate(latestTemperature.measureTime, 'YYYY-MM-DD HH:mm') }}
      </view>
    </view>

    <!-- 体温趋势图 -->
    <view class="chart-section card" v-if="temperatureRecords.length > 0">
      <view class="section-header">
        <text class="section-title">体温趋势</text>
        <picker mode="date" @change="handleDateChange">
          <view class="date-picker">
            <text>{{ selectedDate }}</text>
            <text class="picker-arrow">▼</text>
          </view>
        </picker>
      </view>
      <view class="chart-container">
        <view class="chart-placeholder">
          <text class="placeholder-text">体温趋势图</text>
          <text class="placeholder-desc">（后续集成图表组件）</text>
        </view>
      </view>
    </view>

    <!-- 体温记录列表 -->
    <view class="record-section">
      <view class="section-header">
        <text class="section-title">记录列表</text>
        <text class="record-count">共{{ temperatureRecords.length }}条</text>
      </view>
      
      <view class="record-list" v-if="temperatureRecords.length > 0">
        <view 
          class="record-item card" 
          v-for="record in temperatureRecords" 
          :key="record._id"
          :class="getThemeClass(record.temperature)"
        >
          <view class="record-left">
            <view class="record-temperature">
              <text class="temp-value">{{ record.temperature }}</text>
              <text class="temp-unit">°C</text>
            </view>
            <view class="record-status" :class="getThemeClass(record.temperature)">
              {{ getTemperatureStatus(record.temperature) }}
            </view>
          </view>
          <view class="record-right">
            <view class="record-time">{{ formatDate(record.measureTime, 'MM-DD HH:mm') }}</view>
            <view class="record-part">{{ getMeasurePartText(record.measurePart) }}</view>
            <view class="record-notes" v-if="record.notes">{{ record.notes }}</view>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <text class="empty-icon">🌡️</text>
        <text class="empty-text">暂无体温记录</text>
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
import { HealthStatus, getHealthStatus } from '../../src/utils/theme'
import { formatDate } from '../../src/utils/date'

const healthStore = useHealthStore()

const selectedDate = ref(formatDate(new Date(), 'YYYY-MM-DD'))

// 体温记录列表
const temperatureRecords = computed(() => healthStore.temperatureRecords)

// 最新体温
const latestTemperature = computed(() => healthStore.latestTemperature)

// 当前健康状态
const currentHealthStatus = computed(() => healthStore.currentHealthStatus)

// 主题类名
const themeClass = computed(() => `theme-${currentHealthStatus.value}`)

// 健康状态文本
const healthStatusText = computed(() => {
  const statusMap = {
    [HealthStatus.Healthy]: '正常',
    [HealthStatus.LowFever]: '低烧',
    [HealthStatus.Fever]: '发烧'
  }
  return statusMap[currentHealthStatus.value]
})

/**
 * 根据体温获取主题类名
 */
function getThemeClass(temperature: number): string {
  const status = getHealthStatus(temperature)
  return `theme-${status}`
}

/**
 * 根据体温获取状态文本
 */
function getTemperatureStatus(temperature: number): string {
  const status = getHealthStatus(temperature)
  const statusMap = {
    [HealthStatus.Healthy]: '正常',
    [HealthStatus.LowFever]: '低烧',
    [HealthStatus.Fever]: '发烧'
  }
  return statusMap[status]
}

/**
 * 获取测量部位文本
 */
function getMeasurePartText(part: string): string {
  const partMap: Record<string, string> = {
    oral: '口腔',
    axillary: '腋下',
    rectal: '直肠',
    ear: '耳温'
  }
  return partMap[part] || part
}

/**
 * 日期选择变化
 */
function handleDateChange(e: any) {
  selectedDate.value = e.detail.value
  // TODO: 根据日期筛选记录
}

/**
 * 添加体温记录
 */
function handleAdd() {
  // TODO: 跳转到添加页面或显示弹窗
  uni.showToast({
    title: '添加体温记录',
    icon: 'none'
  })
}

onMounted(() => {
  // 加载模拟数据
  if (temperatureRecords.value.length === 0) {
    const mockRecords = [
      {
        _id: '1',
        childId: '1',
        temperature: 36.5,
        measureTime: new Date().toISOString(),
        measurePart: 'axillary' as const,
        createTime: new Date().toISOString()
      },
      {
        _id: '2',
        childId: '1',
        temperature: 37.2,
        measureTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        measurePart: 'axillary' as const,
        createTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '3',
        childId: '1',
        temperature: 38.1,
        measureTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        measurePart: 'axillary' as const,
        createTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    ]
    healthStore.setTemperatureRecords(mockRecords)
  }
})
</script>

<style lang="scss" scoped>
@import '../../src/styles/variables.scss';

.temperature-page {
  min-height: 100vh;
  padding: $spacing-md;
  padding-bottom: 200rpx;
}

// 体温概览
.temperature-overview {
  margin-bottom: $spacing-lg;
  
  &.theme-healthy {
    background: linear-gradient(135deg, $healthy-light 0%, #FFFFFF 100%);
    border: 2rpx solid $healthy-border;
    
    .overview-status {
      color: $healthy-primary;
    }
  }
  
  &.theme-low-fever {
    background: linear-gradient(135deg, $low-fever-light 0%, #FFFFFF 100%);
    border: 2rpx solid $low-fever-border;
    
    .overview-status {
      color: $low-fever-primary;
    }
  }
  
  &.theme-fever {
    background: linear-gradient(135deg, $fever-light 0%, #FFFFFF 100%);
    border: 2rpx solid $fever-border;
    
    .overview-status {
      color: $fever-primary;
    }
  }
  
  .overview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
  }
  
  .overview-title {
    font-size: $font-md;
    color: $text-secondary;
  }
  
  .overview-status {
    font-size: $font-sm;
    padding: 4rpx 16rpx;
    border-radius: $radius-full;
    
    &.theme-healthy {
      background-color: $healthy-light;
    }
    
    &.theme-low-fever {
      background-color: $low-fever-light;
    }
    
    &.theme-fever {
      background-color: $fever-light;
    }
  }
  
  .overview-value {
    display: flex;
    align-items: baseline;
    margin-bottom: $spacing-sm;
    
    .value-number {
      font-size: 80rpx;
      font-weight: bold;
      color: $text-color;
    }
    
    .value-unit {
      font-size: $font-lg;
      color: $text-secondary;
      margin-left: 8rpx;
    }
  }
  
  .overview-time {
    font-size: $font-sm;
    color: $text-light;
  }
}

// 图表区域
.chart-section {
  margin-bottom: $spacing-lg;
  
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
  
  .date-picker {
    display: flex;
    align-items: center;
    font-size: $font-sm;
    color: $primary-color;
    
    .picker-arrow {
      font-size: $font-xs;
      margin-left: 8rpx;
    }
  }
  
  .chart-container {
    height: 300rpx;
    background-color: $background-color;
    border-radius: $radius-md;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .chart-placeholder {
    text-align: center;
    
    .placeholder-text {
      font-size: $font-md;
      color: $text-light;
    }
    
    .placeholder-desc {
      font-size: $font-sm;
      color: $text-light;
      display: block;
      margin-top: 8rpx;
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
      display: flex;
      margin-bottom: $spacing-md;
      
      &.theme-healthy {
        border-left: 6rpx solid $healthy-primary;
        
        .record-status {
          color: $healthy-primary;
          background-color: $healthy-light;
        }
      }
      
      &.theme-low-fever {
        border-left: 6rpx solid $low-fever-primary;
        
        .record-status {
          color: $low-fever-primary;
          background-color: $low-fever-light;
        }
      }
      
      &.theme-fever {
        border-left: 6rpx solid $fever-primary;
        
        .record-status {
          color: $fever-primary;
          background-color: $fever-light;
        }
      }
    }
    
    .record-left {
      width: 160rpx;
      text-align: center;
      padding-right: $spacing-md;
      border-right: 1rpx solid $border-color;
    }
    
    .record-temperature {
      display: flex;
      align-items: baseline;
      justify-content: center;
      margin-bottom: 8rpx;
      
      .temp-value {
        font-size: 48rpx;
        font-weight: bold;
        color: $text-color;
      }
      
      .temp-unit {
        font-size: $font-sm;
        color: $text-secondary;
        margin-left: 4rpx;
      }
    }
    
    .record-status {
      display: inline-block;
      font-size: $font-xs;
      padding: 4rpx 12rpx;
      border-radius: $radius-sm;
    }
    
    .record-right {
      flex: 1;
      padding-left: $spacing-md;
    }
    
    .record-time {
      font-size: $font-md;
      color: $text-color;
      margin-bottom: 4rpx;
    }
    
    .record-part {
      font-size: $font-sm;
      color: $text-secondary;
      margin-bottom: 4rpx;
    }
    
    .record-notes {
      font-size: $font-sm;
      color: $text-light;
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
