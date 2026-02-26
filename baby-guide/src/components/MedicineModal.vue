<template>
  <view class="modal-mask" v-if="show" @click="handleClose">
    <view class="modal-content" @click.stop>
      <view class="modal-header">
        <text class="modal-title">💊 记录用药</text>
        <view class="modal-close" @click="handleClose">
          <text>✕</text>
        </view>
      </view>

      <view class="modal-body">
        <!-- 药品名称 -->
        <view class="form-item">
          <text class="form-label">药品名称</text>
          <input
            class="form-input"
            v-model="formData.medicineName"
            placeholder="请输入药品名称"
          />
          <!-- 常用药品快捷选择 -->
          <view class="quick-medicine">
            <text class="quick-label">常用：</text>
            <view class="quick-tags">
              <view
                v-for="(med, index) in commonMedicines"
                :key="'med-' + index"
                class="tag-btn"
                :class="{ active: formData.medicineName === med }"
                @click="formData.medicineName = med"
              >
                <text>{{ med }}</text>
              </view>
            </view>
          </view>
        </view>

        <!-- 剂量 -->
        <view class="form-item">
          <text class="form-label">剂量</text>
          <view class="dosage-row">
            <input
              class="form-input dosage-input"
              v-model="formData.dosage"
              placeholder="剂量"
              type="digit"
            />
            <view class="unit-options">
              <view
                v-for="(unit, index) in units"
                :key="'unit-' + index"
                class="unit-btn"
                :class="{ active: formData.unit === unit }"
                @click="formData.unit = unit"
              >
                <text>{{ unit }}</text>
              </view>
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

// 常用药品
const commonMedicines = ['美林', '泰诺林', '小儿氨酚黄那敏颗粒', '布洛芬']

// 单位选项
const units = ['ml', 'mg', '片', '袋']

// 表单数据
const formData = reactive({
  medicineName: '',
  dosage: '',
  unit: 'ml',
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
  formData.medicineName = ''
  formData.dosage = ''
  formData.unit = 'ml'
  formData.notes = ''
}

/**
 * 提交表单
 */
async function handleSubmit() {
  // 验证
  if (!formData.medicineName) {
    uni.showToast({ title: '请输入药品名称', icon: 'none' })
    return
  }

  if (!formData.dosage) {
    uni.showToast({ title: '请输入剂量', icon: 'none' })
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
    // 调用 API 添加用药记录
    const res = await healthStore.addMedicineRecordApi({
      childId: currentChild._id,
      medicineName: formData.medicineName,
      dosage: formData.dosage,
      unit: formData.unit,
      takeTime: new Date().toISOString(),
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

.form-input {
  width: 100%;
  height: 96rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  padding: 0 32rpx;
  font-size: 32rpx;
  box-sizing: border-box;
}

.quick-medicine {
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;

  .quick-label {
    font-size: 24rpx;
    color: #999;
  }

  .quick-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
  }

  .tag-btn {
    padding: 12rpx 24rpx;
    background: #f5f5f5;
    border-radius: 24rpx;
    border: 2rpx solid transparent;

    text {
      font-size: 24rpx;
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

.dosage-row {
  display: flex;
  gap: 20rpx;
  align-items: center;

  .dosage-input {
    flex: 1;
  }

  .unit-options {
    display: flex;
    gap: 12rpx;

    .unit-btn {
      padding: 16rpx 24rpx;
      background: #f5f5f5;
      border-radius: 16rpx;
      border: 2rpx solid transparent;

      text {
        font-size: 26rpx;
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
