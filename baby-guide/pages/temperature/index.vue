<template>
  <view class="temperature-page" :class="themeClass">
    <!-- 当前体温概览 -->
    <view class="temperature-overview">
      <view class="overview-header">
        <text class="overview-title">当前体温</text>
        <view class="overview-status" :class="statusClass">
          <text class="status-dot"></text>
          <text class="status-text">{{ healthStatusText }}</text>
        </view>
      </view>
      <view class="overview-value">
        <text class="value-number">{{ latestTemperature?.temperature || '--' }}</text>
        <text class="value-unit">°C</text>
      </view>
      <view class="overview-time" v-if="latestTemperature">
        测量时间：{{ formatDate(latestTemperature.measureTime, 'YYYY-MM-DD HH:mm') }}
      </view>
    </view>

    <!-- 体温趋势 -->
    <view class="chart-section">
      <view class="chart-header">
        <text class="chart-title">体温趋势</text>
        <view class="time-filter">
          <view 
            class="filter-btn" 
            :class="{ active: timeFilter === 'today' }"
            @click="timeFilter = 'today'"
          >
            <text>今天</text>
          </view>
          <view 
            class="filter-btn" 
            :class="{ active: timeFilter === 'yesterday' }"
            @click="timeFilter = 'yesterday'"
          >
            <text>昨天</text>
          </view>
          <view 
            class="filter-btn" 
            :class="{ active: timeFilter === 'week' }"
            @click="timeFilter = 'week'"
          >
            <text>近7天</text>
          </view>
        </view>
      </view>
      <view class="chart-wrapper" v-if="!showAddModal">
        <TemperatureChart 
          :data="chartData" 
          :height="300"
        />
      </view>
    </view>

    <!-- 体温统计 -->
    <view class="stats-section">
      <view class="stat-card">
        <text class="stat-label">最高体温</text>
        <text class="stat-value high">{{ temperatureStats.max }}°C</text>
      </view>
      <view class="stat-card">
        <text class="stat-label">最低体温</text>
        <text class="stat-value low">{{ temperatureStats.min }}°C</text>
      </view>
      <view class="stat-card">
        <text class="stat-label">平均体温</text>
        <text class="stat-value avg">{{ temperatureStats.avg }}°C</text>
      </view>
    </view>

    <!-- 记录列表 -->
    <view class="record-section">
      <text class="section-title">记录列表</text>
      
      <view class="record-list" v-if="temperatureRecords.length > 0">
        <view 
          class="record-item" 
          :class="getRecordClass(record.temperature)"
          v-for="record in temperatureRecords" 
          :key="record._id"
        >
          <view class="record-header">
            <view class="record-left">
              <text class="record-temp">{{ record.temperature }}°C</text>
              <text class="record-status" :class="getStatusClass(record.temperature)">
                {{ getStatusText(record.temperature) }}
              </text>
            </view>
            <text class="record-time">{{ formatDate(record.measureTime, 'MM-DD HH:mm') }}</text>
          </view>
          <view class="record-detail">
            <text>{{ getMeasurePartText(record.measurePart) }}</text>
            <text v-if="record.notes"> · {{ record.notes }}</text>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <text class="empty-icon">🌡️</text>
        <text class="empty-text">暂无体温记录</text>
      </view>
    </view>

    <!-- 添加按钮 -->
    <view class="add-btn" @click="showAddModal = true">
      <text class="add-icon">+</text>
    </view>

    <!-- 体温录入弹窗 -->
    <TemperatureModal 
      v-model:show="showAddModal" 
      @success="handleRecordSuccess"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHealthStore } from '../../src/store/modules/health'
import { getHealthStatus } from '../../src/utils/theme'
import { formatDate } from '../../src/utils/date'
import TemperatureModal from '../../src/components/TemperatureModal.vue'
import TemperatureChart from '../../src/components/TemperatureChart.vue'

const healthStore = useHealthStore()

const timeFilter = ref('today')
const showAddModal = ref(false)

const temperatureRecords = computed(() => healthStore.temperatureRecords)
const latestTemperature = computed(() => healthStore.latestTemperature)
const currentHealthStatus = computed(() => healthStore.currentHealthStatus)

const themeClass = computed(() => `theme-${currentHealthStatus.value}`)
const statusClass = computed(() => `status-${currentHealthStatus.value}`)

const healthStatusText = computed(() => {
  const statusMap: Record<string, string> = {
    'healthy': '体温正常',
    'low-fever': '低热',
    'fever': '发热'
  }
  return statusMap[currentHealthStatus.value] || '体温正常'
})

const temperatureStats = computed(() => {
  const records = temperatureRecords.value
  if (records.length === 0) {
    return { max: '--', min: '--', avg: '--' }
  }
  
  const temps = records.map(r => r.temperature)
  const max = Math.max(...temps)
  const min = Math.min(...temps)
  const avg = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)
  
  return { max, min, avg }
})

// 图表数据
const chartData = computed(() => {
  return temperatureRecords.value
    .slice()
    .reverse()
    .map(record => ({
      time: record.measureTime,
      temperature: record.temperature
    }))
})

function getRecordClass(temp: number): string {
  const status = getHealthStatus(temp)
  return `record-${status}`
}

function getStatusClass(temp: number): string {
  const status = getHealthStatus(temp)
  return `status-${status}`
}

function getStatusText(temp: number): string {
  const status = getHealthStatus(temp)
  const statusMap: Record<string, string> = {
    'healthy': '正常',
    'low-fever': '低热',
    'fever': '高热'
  }
  return statusMap[status] || '正常'
}

function getMeasurePartText(part: string): string {
  const partMap: Record<string, string> = {
    oral: '口腔测量',
    axillary: '腋下测量',
    rectal: '直肠测量',
    ear: '耳温测量'
  }
  return partMap[part] || part
}

function handleRecordSuccess() {
  // 数据已通过 store 更新
}

onMounted(() => {
  // 加载模拟数据
  if (temperatureRecords.value.length === 0) {
    const mockRecords = [
      {
        _id: '1',
        childId: '1',
        temperature: 38.5,
        measureTime: new Date().toISOString(),
        measurePart: 'axillary' as const,
        createTime: new Date().toISOString()
      },
      {
        _id: '2',
        childId: '1',
        temperature: 37.8,
        measureTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        measurePart: 'axillary' as const,
        createTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '3',
        childId: '1',
        temperature: 39.2,
        measureTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        measurePart: 'ear' as const,
        createTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    ]
    healthStore.setTemperatureRecords(mockRecords)
  }
})
</script>

<style lang="scss" scoped>
.temperature-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 180rpx;
}

// 体温概览
.temperature-overview {
  background: linear-gradient(135deg, var(--theme-primary, #4A90E2) 0%, var(--theme-secondary, #5BA3F5) 100%);
  padding: 48rpx 32rpx;
  margin: 24rpx;
  border-radius: 24rpx;
  color: #fff;
  
  .overview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
  }
  
  .overview-title {
    font-size: 32rpx;
    font-weight: 700;
  }
  
  .overview-status {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 8rpx 20rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 24rpx;
    
    .status-dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
      background: #fff;
    }
    
    .status-text {
      font-size: 24rpx;
      font-weight: 600;
    }
  }
  
  .overview-value {
    display: flex;
    align-items: baseline;
    margin-bottom: 16rpx;
    
    .value-number {
      font-size: 96rpx;
      font-weight: 800;
    }
    
    .value-unit {
      font-size: 40rpx;
      margin-left: 8rpx;
    }
  }
  
  .overview-time {
    font-size: 24rpx;
    opacity: 0.9;
  }
}

// 主题变量
.theme-healthy {
  --theme-primary: #52C41A;
  --theme-secondary: #9BE34D;
}

.theme-low-fever {
  --theme-primary: #FAAD14;
  --theme-secondary: #FFB84D;
}

.theme-fever {
  --theme-primary: #FF4D4F;
  --theme-secondary: #FF4D6A;
}

// 图表区域
.chart-section {
  background: #fff;
  margin: 24rpx;
  border-radius: 24rpx;
  padding: 32rpx;
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
  }
  
  .chart-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #333;
  }
  
  .time-filter {
    display: flex;
    gap: 16rpx;
    
    .filter-btn {
      padding: 12rpx 24rpx;
      background: #f5f5f5;
      border-radius: 20rpx;
      font-size: 24rpx;
      color: #666;
      
      &.active {
        background: rgba(74, 144, 226, 0.1);
        color: #4A90E2;
      }
    }
  }
}

// 统计区域
.stats-section {
  display: flex;
  gap: 16rpx;
  margin: 0 24rpx 24rpx;
  
  .stat-card {
    flex: 1;
    background: #fff;
    border-radius: 20rpx;
    padding: 24rpx;
    text-align: center;
    
    .stat-label {
      font-size: 24rpx;
      color: #999;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .stat-value {
      font-size: 40rpx;
      font-weight: 800;
      
      &.high { color: #FF4D4F; }
      &.low { color: #52C41A; }
      &.avg { color: #FAAD14; }
    }
  }
}

// 记录列表
.record-section {
  margin: 0 24rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }
  
  .record-list {
    .record-item {
      background: #fff;
      border-radius: 20rpx;
      padding: 24rpx;
      margin-bottom: 16rpx;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 8rpx;
      }
      
      &.record-healthy::before { background: #52C41A; }
      &.record-low-fever::before { background: #FAAD14; }
      &.record-fever::before { background: #FF4D4F; }
    }
    
    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12rpx;
    }
    
    .record-left {
      display: flex;
      align-items: center;
      gap: 16rpx;
    }
    
    .record-temp {
      font-size: 40rpx;
      font-weight: 800;
      color: #333;
    }
    
    .record-status {
      padding: 4rpx 16rpx;
      border-radius: 12rpx;
      font-size: 22rpx;
      
      &.status-healthy {
        background: rgba(82, 196, 26, 0.1);
        color: #52C41A;
      }
      
      &.status-low-fever {
        background: rgba(250, 173, 20, 0.1);
        color: #FAAD14;
      }
      
      &.status-fever {
        background: rgba(255, 77, 79, 0.1);
        color: #FF4D4F;
      }
    }
    
    .record-time {
      font-size: 24rpx;
      color: #999;
    }
    
    .record-detail {
      font-size: 26rpx;
      color: #666;
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0;
  
  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 24rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

// 添加按钮
.add-btn {
  position: fixed;
  right: 32rpx;
  bottom: 180rpx;
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF4D4F 0%, #FF6B6B 100%);
  box-shadow: 0 8rpx 24rpx rgba(255, 77, 79, 0.4);
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
