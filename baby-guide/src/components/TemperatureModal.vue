<template>
  <view class="modal-mask" v-if="show" @click="handleClose">
    <view class="modal-content" @click.stop>
      <view class="modal-header">
        <text class="modal-title">🌡️ 记录体温</text>
        <view class="modal-close" @click="handleClose">
          <text>✕</text>
        </view>
      </view>

      <view class="modal-body">
        <!-- 体温输入 -->
        <view class="form-item">
          <text class="form-label">体温 (℃)</text>
          <view class="temperature-input-wrapper">
            <input
              class="temperature-input"
              type="digit"
              v-model="formData.temperature"
              placeholder="36.5"
              maxlength="5"
            />
            <text class="temperature-unit">°C</text>
          </view>
          <!-- 快捷温度按钮 -->
          <view class="quick-temp-buttons">
            <view
              v-for="(temp, index) in quickTemps"
              :key="'temp-' + index"
              class="temp-btn"
              :class="{ active: formData.temperature === temp }"
              @click="formData.temperature = temp"
            >
              <text>{{ temp }}°C</text>
            </view>
          </view>
        </view>

        <!-- 测量部位 -->
        <view class="form-item">
          <text class="form-label">测量部位</text>
          <view class="part-options">
            <view
              v-for="(part, index) in measureParts"
              :key="'part-' + index"
              class="part-option"
              :class="{ active: formData.measurePart === part.value }"
              @click="formData.measurePart = part.value"
            >
              <text class="part-icon">{{ part.icon }}</text>
              <text class="part-name">{{ part.label }}</text>
            </view>
          </view>
        </view>

        <!-- 备注 -->
        <view class="form-item">
          <text class="form-label">备注 (选填)</text>
          <textarea
            class="form-textarea"
            v-model="formData.notes"
            placeholder="添加备注信息..."
            :maxlength="100"
          />
        </view>
      </view>

      <view class="modal-footer">
        <view class="btn-cancel" @click="handleClose">
          <text>取消</text>
        </view>
        <view class="btn-confirm" @click="handleSubmit">
          <text>保存记录</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useHealthStore } from '../store/modules/health'
import { useChildrenStore } from '../store/modules/children'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const healthStore = useHealthStore()
const childrenStore = useChildrenStore()
const loading = ref(false)

// 快捷温度
const quickTemps = ['36.5', '37.0', '37.5', '38.0', '38.5', '39.0']

// 测量部位
const measureParts = [
  { value: 'ear', label: '耳温', icon: '👂' },
  { value: 'axillary', label: '腋下', icon: '💪' },
  { value: 'oral', label: '口腔', icon: '👄' },
  { value: 'rectal', label: '直肠', icon: '🌡️' }
]

// 表单数据
const formData = reactive({
  temperature: '',
  measurePart: 'ear',
  notes: ''
})

/**
 * 关闭弹窗
 */
function handleClose() {
  emit('update:show', false)
  resetForm()
}

/**
 * 重置表单
 */
function resetForm() {
  formData.temperature = ''
  formData.measurePart = 'ear'
  formData.notes = ''
}

/**
 * 提交表单
 */
async function handleSubmit() {
  // 验证体温
  if (!formData.temperature) {
    uni.showToast({ title: '请输入体温', icon: 'none' })
    return
  }

  const temp = parseFloat(formData.temperature)
  if (isNaN(temp) || temp < 35 || temp > 42) {
    uni.showToast({ title: '体温范围应在35-42°C之间', icon: 'none' })
    return
  }

  // 检查是否有选中的儿童
  const currentChild = childrenStore.currentChild
  if (!currentChild) {
    uni.showToast({ title: '请先添加儿童档案', icon: 'none' })
    return
  }

  loading.value = true

  try {
    // 调用 API 添加体温记录
    const res = await healthStore.addTemperatureRecordApi({
      childId: currentChild._id,
      temperature: temp,
      measureTime: new Date().toISOString(),
      measurePart: formData.measurePart as 'oral' | 'axillary' | 'rectal' | 'ear',
      notes: formData.notes
    })

    if (res.success) {
      uni.showToast({ title: '记录成功', icon: 'success' })
      emit('success')
      handleClose()
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  background: #FFFFFF;
  border-radius: 40rpx 40rpx 0 0;
  max-height: 85vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx 48rpx;
  border-bottom: 1rpx solid #eee;

  .modal-title {
    font-size: 40rpx;
    font-weight: 700;
    color: #333;
  }

  .modal-close {
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      font-size: 32rpx;
      color: #999;
    }
  }
}

.modal-body {
  padding: 40rpx 48rpx;
}

.form-item {
  margin-bottom: 40rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.temperature-input-wrapper {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 20rpx;

  .temperature-input {
    flex: 1;
    font-size: 64rpx;
    font-weight: bold;
    color: #333;
    text-align: center;
    height: 100rpx;
  }

  .temperature-unit {
    font-size: 32rpx;
    color: #999;
    margin-left: 10rpx;
  }
}

.quick-temp-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .temp-btn {
    flex: 1;
    min-width: 120rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 16rpx;
    border: 4rpx solid transparent;

    text {
      font-size: 28rpx;
      color: #666;
    }

    &.active {
      background: rgba(74, 144, 226, 0.1);
      border-color: #4A90E2;

      text {
        color: #4A90E2;
      }
    }
  }
}

.part-options {
  display: flex;
  gap: 20rpx;

  .part-option {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30rpx 20rpx;
    background: #f5f5f5;
    border-radius: 20rpx;
    border: 4rpx solid transparent;
    transition: all 0.3s;

    &.active {
      background: rgba(74, 144, 226, 0.1);
      border-color: #4A90E2;
    }

    .part-icon {
      font-size: 48rpx;
      margin-bottom: 10rpx;
    }

    .part-name {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.form-textarea {
  width: 100%;
  min-height: 160rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  padding: 20rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.modal-footer {
  display: flex;
  gap: 30rpx;
  padding: 32rpx 48rpx;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));

  .btn-cancel,
  .btn-confirm {
    flex: 1;
    height: 96rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 48rpx;

    text {
      font-size: 32rpx;
      font-weight: 600;
    }
  }

  .btn-cancel {
    background: #f5f5f5;

    text {
      color: #666;
    }
  }

  .btn-confirm {
    background: #4A90E2;

    text {
      color: #fff;
    }
  }
}
</style>
