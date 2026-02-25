<template>
  <view class="modal-mask" v-if="show" @click="handleClose">
    <view class="modal-content" @click.stop>
      <view class="modal-header">
        <text class="modal-title">📝 记录症状</text>
        <view class="modal-close" @click="handleClose">
          <text>✕</text>
        </view>
      </view>

      <view class="modal-body">
        <!-- 症状选择 -->
        <view class="form-item">
          <text class="form-label">症状类型</text>
          <view class="symptom-grid">
            <view
              v-for="(symptom, index) in symptomOptions"
              :key="'symptom-' + index"
              class="symptom-item"
              :class="{ active: formData.symptoms.includes(symptom.value) }"
              @click="toggleSymptom(symptom.value)"
            >
              <text class="symptom-icon">{{ symptom.icon }}</text>
              <text class="symptom-name">{{ symptom.label }}</text>
            </view>
          </view>
        </view>

        <!-- 严重程度 -->
        <view class="form-item">
          <text class="form-label">严重程度</text>
          <view class="severity-options">
            <view
              v-for="(level, index) in severityLevels"
              :key="'severity-' + index"
              class="severity-item"
              :class="{ active: formData.severity === level.value }"
              @click="formData.severity = level.value"
            >
              <view class="severity-dot" :style="{ background: level.color }"></view>
              <text class="severity-name">{{ level.label }}</text>
            </view>
          </view>
        </view>

        <!-- 详细描述 -->
        <view class="form-item">
          <text class="form-label">详细描述</text>
          <textarea
            class="form-textarea"
            v-model="formData.description"
            placeholder="请描述症状的详细情况..."
            :maxlength="200"
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
const loading = ref(false)

// 症状选项
const symptomOptions = [
  { value: 'fever', label: '发热', icon: '🌡️' },
  { value: 'cough', label: '咳嗽', icon: '😷' },
  { value: 'runny_nose', label: '流涕', icon: '🤧' },
  { value: 'sore_throat', label: '咽痛', icon: '😫' },
  { value: 'vomiting', label: '呕吐', icon: '🤢' },
  { value: 'diarrhea', label: '腹泻', icon: '💩' },
  { value: 'rash', label: '皮疹', icon: '🔴' },
  { value: 'headache', label: '头痛', icon: '🤕' },
  { value: 'stomachache', label: '腹痛', icon: '😣' },
  { value: 'loss_appetite', label: '食欲不振', icon: '🍽️' }
]

// 严重程度
const severityLevels = [
  { value: 'mild', label: '轻微', color: '#52C41A' },
  { value: 'moderate', label: '中等', color: '#FAAD14' },
  { value: 'severe', label: '严重', color: '#FF4D4F' }
]

// 表单数据
const formData = reactive({
  symptoms: [] as string[],
  severity: 'mild',
  description: ''
})

/**
 * 切换症状选择
 */
function toggleSymptom(symptom: string) {
  const index = formData.symptoms.indexOf(symptom)
  if (index === -1) {
    formData.symptoms.push(symptom)
  } else {
    formData.symptoms.splice(index, 1)
  }
}

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
  formData.symptoms = []
  formData.severity = 'mild'
  formData.description = ''
}

/**
 * 提交表单
 */
async function handleSubmit() {
  // 验证
  if (formData.symptoms.length === 0) {
    uni.showToast({ title: '请至少选择一项症状', icon: 'none' })
    return
  }

  loading.value = true

  try {
    // 添加症状记录
    healthStore.addSymptomRecord({
      _id: Date.now().toString(),
      childId: '1',
      symptoms: formData.symptoms,
      severity: formData.severity as any,
      recordTime: new Date().toISOString(),
      notes: formData.description,
      createTime: new Date().toISOString()
    })

    uni.showToast({ title: '记录成功', icon: 'success' })
    emit('success')
    handleClose()
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

.symptom-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20rpx;

  .symptom-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 10rpx;
    background: #f5f5f5;
    border-radius: 16rpx;
    border: 4rpx solid transparent;
    transition: all 0.3s;

    &.active {
      background: rgba(74, 144, 226, 0.1);
      border-color: #4A90E2;
    }

    .symptom-icon {
      font-size: 40rpx;
      margin-bottom: 8rpx;
    }

    .symptom-name {
      font-size: 22rpx;
      color: #666;
    }
  }
}

.severity-options {
  display: flex;
  gap: 20rpx;

  .severity-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;
    padding: 24rpx;
    background: #f5f5f5;
    border-radius: 16rpx;
    border: 4rpx solid transparent;
    transition: all 0.3s;

    &.active {
      background: rgba(74, 144, 226, 0.1);
      border-color: #4A90E2;
    }

    .severity-dot {
      width: 16rpx;
      height: 16rpx;
      border-radius: 50%;
    }

    .severity-name {
      font-size: 28rpx;
      color: #333;
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
