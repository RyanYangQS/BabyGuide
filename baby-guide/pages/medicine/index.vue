<template>
  <view class="medicine-page">
    <!-- 用药提醒 -->
    <view class="medicine-alert">
      <view class="alert-header">
        <text class="alert-icon">⏰</text>
        <view class="alert-info">
          <text class="alert-title">下次可用时间</text>
          <text class="alert-time">{{ nextAvailableTime }}</text>
        </view>
      </view>
      <view class="alert-countdown" v-if="countdown">
        <text class="countdown-text">{{ countdown }}</text>
      </view>
      <view class="alert-stats">
        <text class="stats-label">📊 今日用药统计</text>
        <text class="stats-value" v-for="stat in todayStats" :key="stat.name">
          {{ stat.name }}: {{ stat.current }}/{{ stat.max }}次
        </text>
      </view>
    </view>

    <!-- 用药记录 -->
    <view class="medicine-section">
      <text class="section-title">用药记录</text>
      
      <view class="medicine-list" v-if="medicineRecords.length > 0">
        <view 
          class="medicine-item" 
          v-for="record in medicineRecords" 
          :key="record._id"
        >
          <view class="medicine-header">
            <view class="medicine-info">
              <text class="medicine-name">{{ record.medicineName }}</text>
              <text class="medicine-dosage">{{ record.dosage }}{{ record.unit }}</text>
            </view>
            <text class="medicine-time">{{ formatDate(record.takeTime, 'MM-DD HH:mm') }}</text>
          </view>
          <view class="medicine-next" v-if="record.nextTakeTime">
            <text class="next-icon">⏱</text>
            <text class="next-text">下次可用: {{ formatDate(record.nextTakeTime, 'HH:mm') }}</text>
          </view>
          <view class="medicine-notes" v-if="record.notes">
            <text>{{ record.notes }}</text>
          </view>
        </view>
      </view>
      
      <view class="empty-state" v-else>
        <text class="empty-icon">💊</text>
        <text class="empty-text">暂无用药记录</text>
      </view>
    </view>

    <!-- 添加按钮 -->
    <view class="add-btn" @click="showAddModal = true">
      <text class="add-icon">+</text>
    </view>

    <!-- 用药录入弹窗 -->
    <MedicineModal 
      v-model:show="showAddModal" 
      @success="handleRecordSuccess"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHealthStore } from '../../src/store/modules/health'
import { formatDate } from '../../src/utils/date'
import MedicineModal from '../../src/components/MedicineModal.vue'

const healthStore = useHealthStore()

const showAddModal = ref(false)
const nextAvailableTime = ref('--:--')
const countdown = ref('')

const medicineRecords = computed(() => healthStore.medicineRecords)

const todayStats = computed(() => {
  // 模拟今日用药统计
  return [
    { name: '美林', current: 2, max: 4 },
    { name: '泰诺林', current: 1, max: 4 }
  ]
})

function handleRecordSuccess() {
  // 数据已通过 store 更新
  updateNextAvailableTime()
}

function updateNextAvailableTime() {
  // 模拟计算下次可用时间
  const now = new Date()
  const next = new Date(now.getTime() + 4 * 60 * 60 * 1000)
  nextAvailableTime.value = formatDate(next, 'HH:mm')
  
  // 计算倒计时
  const diff = next.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  countdown.value = `(还剩${hours}小时${minutes}分钟)`
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
        takeTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        nextTakeTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        createTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        _id: '2',
        childId: '1',
        medicineId: '2',
        medicineName: '泰诺林',
        dosage: '3',
        unit: 'ml',
        takeTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        createTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ]
    healthStore.setMedicineRecords(mockRecords)
  }
  
  updateNextAvailableTime()
})
</script>

<style lang="scss" scoped>
.medicine-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 180rpx;
}

// 用药提醒
.medicine-alert {
  background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);
  margin: 24rpx;
  border-radius: 24rpx;
  padding: 32rpx;
  color: #fff;
  
  .alert-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 16rpx;
  }
  
  .alert-icon {
    font-size: 48rpx;
  }
  
  .alert-info {
    flex: 1;
  }
  
  .alert-title {
    font-size: 28rpx;
    opacity: 0.9;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .alert-time {
    font-size: 48rpx;
    font-weight: 800;
  }
  
  .alert-countdown {
    margin-bottom: 20rpx;
    
    .countdown-text {
      font-size: 26rpx;
      opacity: 0.9;
    }
  }
  
  .alert-stats {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16rpx;
    padding: 20rpx;
    
    .stats-label {
      font-size: 26rpx;
      display: block;
      margin-bottom: 12rpx;
    }
    
    .stats-value {
      font-size: 28rpx;
      display: block;
      margin-top: 8rpx;
    }
  }
}

// 用药记录
.medicine-section {
  margin: 24rpx;
  
  .section-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #333;
    margin-bottom: 24rpx;
    display: block;
  }
  
  .medicine-list {
    .medicine-item {
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
        background: #4A90E2;
      }
    }
    
    .medicine-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12rpx;
    }
    
    .medicine-info {
      display: flex;
      flex-direction: column;
    }
    
    .medicine-name {
      font-size: 32rpx;
      font-weight: 700;
      color: #333;
      margin-bottom: 4rpx;
    }
    
    .medicine-dosage {
      font-size: 26rpx;
      color: #666;
    }
    
    .medicine-time {
      font-size: 24rpx;
      color: #999;
    }
    
    .medicine-next {
      display: flex;
      align-items: center;
      gap: 8rpx;
      padding: 12rpx 16rpx;
      background: rgba(74, 144, 226, 0.1);
      border-radius: 12rpx;
      margin-bottom: 12rpx;
      
      .next-icon {
        font-size: 24rpx;
      }
      
      .next-text {
        font-size: 24rpx;
        color: #4A90E2;
      }
    }
    
    .medicine-notes {
      font-size: 24rpx;
      color: #999;
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
  background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);
  box-shadow: 0 8rpx 24rpx rgba(74, 144, 226, 0.4);
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
