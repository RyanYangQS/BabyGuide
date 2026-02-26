<template>
  <view class="index-page" :class="themeClass">
    <!-- 未登录提示 -->
    <view class="login-prompt" v-if="!isLoggedIn">
      <view class="prompt-card">
        <text class="prompt-icon">🔐</text>
        <text class="prompt-title">欢迎使用养娃不易</text>
        <text class="prompt-text">请先登录以使用完整功能</text>
        <view class="prompt-btn" @click="handleLogin">
          <text>微信登录</text>
        </view>
      </view>
    </view>

    <!-- 已登录但无儿童档案 -->
    <view class="no-child" v-else-if="!currentChild">
      <view class="no-child-card">
        <text class="no-child-icon">👶</text>
        <text class="no-child-title">还没有儿童档案</text>
        <text class="no-child-text">添加儿童档案开始记录</text>
        <view class="add-child-btn" @click="handleAddChild">
          <text>添加儿童</text>
        </view>
      </view>
    </view>

    <!-- 正常内容 -->
    <template v-else>
      <!-- 儿童档案卡片 -->
      <view class="child-card">
        <view class="child-info" @click="handleChildClick">
          <view class="child-avatar">{{ currentChild?.name?.charAt(0) || '宝' }}</view>
          <view class="child-details">
            <text class="child-name">{{ currentChild?.name }}</text>
            <text class="child-meta">{{ formatAge(currentChild.birthday) }} · {{ currentChild.gender === 'male' ? '男' : '女' }}</text>
            <text class="child-status">{{ healthStatusEmoji }} {{ healthText }}</text>
          </view>
        </view>
        <!-- 切换儿童按钮 -->
        <view class="switch-btn" v-if="childrenList.length > 1" @click="showChildSwitch = true">
          <text class="switch-icon">⇅</text>
        </view>
      </view>

      <!-- 今日概览 -->
      <view class="overview-section">
        <text class="section-title">今日概览</text>
        <view class="overview-cards">
          <view class="overview-card temperature">
            <text class="value">{{ latestTemperature?.temperature || '--' }}℃</text>
            <text class="label">体温</text>
          </view>
          <view class="overview-card medicine">
            <text class="value">{{ todayMedicineCount }}次</text>
            <text class="label">用药</text>
          </view>
          <view class="overview-card symptom">
            <text class="value">{{ todaySymptomCount }}条</text>
            <text class="label">症状</text>
          </view>
        </view>
      </view>

      <!-- 快速记录 -->
      <view class="quick-actions">
        <text class="section-title">快速记录</text>
        <view class="action-buttons">
          <view class="action-btn temperature-btn" @click="showTemperatureModal = true">
            <view class="action-icon">🌡️</view>
            <text class="action-text">体温</text>
          </view>
          <view class="action-btn medicine-btn" @click="showMedicineModal = true">
            <view class="action-icon">💊</view>
            <text class="action-text">用药</text>
          </view>
          <view class="action-btn symptom-btn" @click="showSymptomModal = true">
            <view class="action-icon">📝</view>
            <text class="action-text">症状</text>
          </view>
        </view>
      </view>

      <!-- 最近记录 -->
      <view class="recent-records">
        <text class="section-title">最近记录</text>
        
        <view class="record-list" v-if="recentRecords.length > 0">
          <view 
            class="record-item" 
            :class="record.type"
            v-for="record in recentRecords" 
            :key="record._id"
          >
            <view class="record-header">
              <text class="record-type">{{ record.icon }} {{ record.title }}</text>
              <text class="record-time">{{ record.time }}</text>
            </view>
            <text class="record-content">{{ record.content }}</text>
          </view>
        </view>
        
        <view class="empty-state" v-else>
          <text class="empty-icon">📋</text>
          <text class="empty-text">暂无记录</text>
        </view>
      </view>

      <!-- 快速录入按钮（右下角+） -->
      <view class="quick-add-btn" @click="showQuickAddModal = true">
        <text class="plus-icon">+</text>
      </view>

      <!-- 弹窗组件 -->
      <TemperatureModal 
        v-model:show="showTemperatureModal" 
        @success="handleRecordSuccess"
      />
      <MedicineModal 
        v-model:show="showMedicineModal" 
        @success="handleRecordSuccess"
      />
      <SymptomModal 
        v-model:show="showSymptomModal" 
        @success="handleRecordSuccess"
      />
      <QuickAddModal 
        v-model:show="showQuickAddModal" 
        @success="handleRecordSuccess"
      />
      
      <!-- 儿童切换弹窗 -->
      <ChildSwitchModal 
        v-model:show="showChildSwitch"
        @change="handleChildChange"
      />
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ChildSwitchModal from '../../src/components/ChildSwitchModal.vue'
import MedicineModal from '../../src/components/MedicineModal.vue'
import QuickAddModal from '../../src/components/QuickAddModal.vue'
import SymptomModal from '../../src/components/SymptomModal.vue'
import TemperatureModal from '../../src/components/TemperatureModal.vue'
import { useChildrenStore } from '../../src/store/modules/children'
import { useHealthStore } from '../../src/store/modules/health'
import { useUserStore } from '../../src/store/modules/user'
import type { Child } from '../../src/types'
import { formatAge, formatDate } from '../../src/utils/date'
import { getHealthStatus } from '../../src/utils/theme'

const childrenStore = useChildrenStore()
const userStore = useUserStore()
const healthStore = useHealthStore()

// 登录状态
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 弹窗显示状态
const showTemperatureModal = ref(false)
const showMedicineModal = ref(false)
const showSymptomModal = ref(false)
const showQuickAddModal = ref(false)
const showChildSwitch = ref(false)

// 当前儿童
const currentChild = computed(() => childrenStore.currentChild)
const childrenList = computed(() => childrenStore.childrenList)
const latestTemperature = computed(() => healthStore.latestTemperature)
const todayMedicineCount = computed(() => healthStore.todayMedicineRecords.length)
const todaySymptomCount = computed(() => healthStore.symptomRecords.length)
const currentHealthStatus = computed(() => healthStore.currentHealthStatus)
const themeClass = computed(() => `theme-${currentHealthStatus.value}`)

const healthText = computed(() => {
  const statusMap: Record<string, string> = {
    'healthy': '健康状态良好',
    'low-fever': '低热状态',
    'fever': '发热状态'
  }
  return statusMap[currentHealthStatus.value] || '健康状态良好'
})

const healthStatusEmoji = computed(() => {
  const emojiMap: Record<string, string> = {
    'healthy': '🟢',
    'low-fever': '🟡',
    'fever': '🔴'
  }
  return emojiMap[currentHealthStatus.value] || '🟢'
})

const recentRecords = computed(() => {
  const records: any[] = []
  
  healthStore.temperatureRecords.slice(0, 3).forEach((record: any) => {
    const status = getHealthStatus(record.temperature)
    const statusText = status === 'healthy' ? '正常' : status === 'low-fever' ? '低热' : '高热'
    records.push({
      _id: record._id,
      type: status === 'fever' ? 'high-fever' : status === 'low-fever' ? 'low-fever' : 'normal',
      icon: status === 'healthy' ? '🟢' : status === 'low-fever' ? '🟡' : '🔴',
      title: `体温 ${record.temperature}℃`,
      time: formatDate(record.measureTime, '今天 HH:mm'),
      content: `${statusText} | ${getMeasurePartText(record.measurePart)}`,
      sortTime: new Date(record.measureTime).getTime()
    })
  })
  
  healthStore.medicineRecords.slice(0, 3).forEach((record: any) => {
    records.push({
      _id: record._id,
      type: 'medicine',
      icon: '💊',
      title: `用药 ${record.medicineName}`,
      time: formatDate(record.takeTime, '今天 HH:mm'),
      content: `剂量: ${record.dosage}${record.unit}`,
      sortTime: new Date(record.takeTime).getTime()
    })
  })
  
  healthStore.symptomRecords.slice(0, 3).forEach((record: any) => {
    records.push({
      _id: record._id,
      type: 'symptom',
      icon: '📝',
      title: `症状 ${record.symptoms.join('、')}`,
      time: formatDate(record.recordTime, '今天 HH:mm'),
      content: `严重程度: ${getSeverityText(record.severity)}`,
      sortTime: new Date(record.recordTime).getTime()
    })
  })
  
  return records.sort((a, b) => b.sortTime - a.sortTime).slice(0, 5)
})

function getMeasurePartText(part: string): string {
  const partMap: Record<string, string> = {
    oral: '口腔测量',
    axillary: '腋下测量',
    rectal: '直肠测量',
    ear: '耳温测量'
  }
  return partMap[part] || part
}

function getSeverityText(severity: string): string {
  const severityMap: Record<string, string> = {
    mild: '轻微',
    moderate: '中等',
    severe: '严重'
  }
  return severityMap[severity] || severity
}

/**
 * 登录
 */
async function handleLogin() {
  uni.showLoading({ title: '登录中...', mask: true })
  const res = await userStore.login()
  uni.hideLoading()
  
  if (res.success) {
    uni.showToast({ title: '登录成功', icon: 'success' })
    await childrenStore.fetchChildren()
  } else {
    uni.showToast({ title: res.errMsg || '登录失败', icon: 'none' })
  }
}

/**
 * 添加儿童
 */
function handleAddChild() {
  uni.navigateTo({ url: '/pages/profile/addChild' })
}

function handleChildClick() {
  uni.navigateTo({ url: '/pages/profile/childDetail' })
}

function handleRecordSuccess() {
  // 数据已通过 store 更新
}

function handleChildChange(child: Child) {
  childrenStore.setCurrentChild(child)
  // 重新加载健康数据
  if (child._id) {
    healthStore.fetchTemperatureRecords(child._id)
    healthStore.fetchMedicineRecords(child._id)
    healthStore.fetchSymptomRecords(child._id)
  }
}

// 监听当前儿童变化，加载健康数据
watch(currentChild, (child) => {
  if (child && child._id) {
    healthStore.fetchHealthOverview(child._id)
  }
}, { immediate: true })

onMounted(async () => {
  // 检查登录状态
  userStore.checkLoginStatus()
  
  // 如果已登录，加载儿童列表
  if (isLoggedIn.value) {
    await childrenStore.fetchChildren()
  }
})
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 180rpx;
}

// 未登录提示
.login-prompt {
  padding: 100rpx 32rpx;
  
  .prompt-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 80rpx 40rpx;
    text-align: center;
  }
  
  .prompt-icon {
    font-size: 120rpx;
    display: block;
    margin-bottom: 32rpx;
  }
  
  .prompt-title {
    font-size: 40rpx;
    font-weight: 700;
    color: #333;
    display: block;
    margin-bottom: 16rpx;
  }
  
  .prompt-text {
    font-size: 28rpx;
    color: #999;
    display: block;
    margin-bottom: 48rpx;
  }
  
  .prompt-btn {
    display: inline-block;
    padding: 24rpx 80rpx;
    background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);
    border-radius: 48rpx;
    
    text {
      font-size: 32rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}

// 无儿童档案
.no-child {
  padding: 100rpx 32rpx;
  
  .no-child-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 80rpx 40rpx;
    text-align: center;
  }
  
  .no-child-icon {
    font-size: 120rpx;
    display: block;
    margin-bottom: 32rpx;
  }
  
  .no-child-title {
    font-size: 40rpx;
    font-weight: 700;
    color: #333;
    display: block;
    margin-bottom: 16rpx;
  }
  
  .no-child-text {
    font-size: 28rpx;
    color: #999;
    display: block;
    margin-bottom: 48rpx;
  }
  
  .add-child-btn {
    display: inline-block;
    padding: 24rpx 80rpx;
    background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);
    border-radius: 48rpx;
    
    text {
      font-size: 32rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}

.child-card {
  background: linear-gradient(135deg, var(--theme-primary, #4A90E2) 0%, var(--theme-secondary, #5BA3F5) 100%);
  padding: 40rpx 32rpx;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  }
  
  .child-info {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
  }
  
  .child-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    color: var(--theme-primary, #4A90E2);
    font-weight: bold;
    margin-right: 32rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  }
  
  .child-details {
    flex: 1;
  }
  
  .child-name {
    font-size: 40rpx;
    font-weight: 700;
    color: #FFFFFF;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .child-meta {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
    display: block;
    margin-bottom: 8rpx;
  }
  
  .child-status {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.85);
  }
  
  .switch-btn {
    position: absolute;
    right: 32rpx;
    top: 50%;
    transform: translateY(-50%);
    width: 64rpx;
    height: 64rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    
    .switch-icon {
      font-size: 32rpx;
      color: #fff;
    }
  }
}

.overview-section {
  padding: 32rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }
  
  .overview-cards {
    display: flex;
    gap: 24rpx;
  }
  
  .overview-card {
    flex: 1;
    background: #FFFFFF;
    border-radius: 24rpx;
    padding: 32rpx 16rpx;
    text-align: center;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
    
    .value {
      font-size: 48rpx;
      font-weight: 800;
      display: block;
      margin-bottom: 8rpx;
    }
    
    .label {
      font-size: 24rpx;
      color: #999;
    }
    
    &.temperature .value { color: #FF4D4F; }
    &.medicine .value { color: #4A90E2; }
    &.symptom .value { color: #FAAD14; }
  }
}

.quick-actions {
  padding: 0 32rpx 32rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }
  
  .action-buttons {
    display: flex;
    gap: 24rpx;
  }
  
  .action-btn {
    flex: 1;
    background: #FFFFFF;
    border-radius: 24rpx;
    padding: 40rpx 24rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
    
    .action-icon {
      width: 96rpx;
      height: 96rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;
      font-size: 48rpx;
    }
    
    .action-text {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
    }
    
    &.temperature-btn .action-icon { background: rgba(255, 77, 79, 0.1); }
    &.medicine-btn .action-icon { background: rgba(74, 144, 226, 0.1); }
    &.symptom-btn .action-icon { background: rgba(250, 173, 20, 0.1); }
  }
}

.recent-records {
  padding: 0 32rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }
  
  .record-list {
    .record-item {
      background: #FFFFFF;
      border-radius: 24rpx;
      padding: 32rpx;
      margin-bottom: 24rpx;
      box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
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
      
      &.high-fever::before { background: #FF4D4F; }
      &.low-fever::before { background: #FAAD14; }
      &.normal::before { background: #52C41A; }
      &.medicine::before { background: #4A90E2; }
      &.symptom::before { background: #FAAD14; }
    }
    
    .record-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16rpx;
    }
    
    .record-type {
      font-size: 32rpx;
      font-weight: 700;
      color: #333;
    }
    
    .record-time {
      font-size: 24rpx;
      color: #999;
    }
    
    .record-content {
      font-size: 28rpx;
      color: #666;
    }
  }
}

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

.quick-add-btn {
  position: fixed;
  right: 32rpx;
  bottom: 180rpx;
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);
  box-shadow: 0 8rpx 24rpx rgba(74, 144, 226, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  
  .plus-icon {
    font-size: 48rpx;
    color: #FFFFFF;
    font-weight: bold;
  }
}

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
</style>
