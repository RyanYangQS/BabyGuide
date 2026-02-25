<template>
  <view class="modal-mask" v-if="show" @click="handleClose">
    <view class="modal-content" @click.stop>
      <view class="modal-header">
        <text class="modal-title">快速录入</text>
        <view class="modal-close" @click="handleClose">
          <text>✕</text>
        </view>
      </view>

      <!-- Tab 切换 -->
      <view class="tab-bar">
        <view
          v-for="(tab, index) in tabs"
          :key="'tab-' + index"
          class="tab-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <text class="tab-icon">{{ tab.icon }}</text>
          <text class="tab-text">{{ tab.label }}</text>
        </view>
      </view>

      <!-- 体温录入 -->
      <view v-if="activeTab === 'temperature'" class="tab-content">
        <view class="form-item">
          <text class="form-label">体温 (℃)</text>
          <view class="temperature-input-wrapper">
            <input
              class="temperature-input"
              type="digit"
              v-model="temperatureForm.temperature"
              placeholder="36.5"
              maxlength="5"
            />
            <text class="temperature-unit">°C</text>
          </view>
          <view class="quick-temp-buttons">
            <view
              v-for="(temp, index) in quickTemps"
              :key="'temp-' + index"
              class="temp-btn"
              :class="{ active: temperatureForm.temperature === temp }"
              @click="temperatureForm.temperature = temp"
            >
              <text>{{ temp }}°C</text>
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">测量部位</text>
          <view class="part-options">
            <view
              v-for="(part, index) in measureParts"
              :key="'part-' + index"
              class="part-option"
              :class="{ active: temperatureForm.measurePart === part.value }"
              @click="temperatureForm.measurePart = part.value"
            >
              <text class="part-icon">{{ part.icon }}</text>
              <text class="part-name">{{ part.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 用药录入 -->
      <view v-if="activeTab === 'medicine'" class="tab-content">
        <view class="form-item">
          <text class="form-label">药品名称</text>
          <input
            class="form-input"
            v-model="medicineForm.medicineName"
            placeholder="请输入药品名称"
          />
          <view class="quick-medicine">
            <text class="quick-label">常用：</text>
            <view class="quick-tags">
              <view
                v-for="(med, index) in commonMedicines"
                :key="'med-' + index"
                class="tag-btn"
                :class="{ active: medicineForm.medicineName === med }"
                @click="medicineForm.medicineName = med"
              >
                <text>{{ med }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">剂量</text>
          <view class="dosage-row">
            <input
              class="form-input dosage-input"
              v-model="medicineForm.dosage"
              placeholder="剂量"
              type="digit"
            />
            <view class="unit-options">
              <view
                v-for="(unit, index) in units"
                :key="'unit-' + index"
                class="unit-btn"
                :class="{ active: medicineForm.unit === unit }"
                @click="medicineForm.unit = unit"
              >
                <text>{{ unit }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 症状录入 -->
      <view v-if="activeTab === 'symptom'" class="tab-content">
        <view class="form-item">
          <text class="form-label">症状类型</text>
          <view class="symptom-tags">
            <view
              v-for="(symptom, index) in symptomOptions"
              :key="'symptom-' + index"
              class="tag-btn symptom-tag"
              :class="{ active: symptomForm.symptoms.includes(symptom.value) }"
              @click="toggleSymptom(symptom.value)"
            >
              <text>{{ symptom.label }}</text>
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="form-label">严重程度</text>
          <view class="severity-options">
            <view
              v-for="(level, index) in severityLevels"
              :key="'severity-' + index"
              class="severity-item"
              :class="{ active: symptomForm.severity === level.value }"
              @click="symptomForm.severity = level.value"
            >
              <view class="severity-dot" :style="{ background: level.color }"></view>
              <text class="severity-name">{{ level.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 备注 -->
      <view class="form-item">
        <text class="form-label">备注 (选填)</text>
        <textarea
          class="form-textarea"
          v-model="currentNotes"
          placeholder="添加备注信息..."
          :maxlength="100"
        />
      </view>

      <!-- 提交按钮 -->
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
import { ref, reactive, computed } from 'vue'
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
const activeTab = ref('temperature')

// Tab 配置
const tabs = [
  { key: 'temperature', label: '体温', icon: '🌡️' },
  { key: 'medicine', label: '用药', icon: '💊' },
  { key: 'symptom', label: '症状', icon: '📝' }
]

// 快捷温度
const quickTemps = ['36.5', '37.0', '37.5', '38.0', '38.5', '39.0']

// 测量部位
const measureParts = [
  { value: 'ear', label: '耳温', icon: '👂' },
  { value: 'axillary', label: '腋下', icon: '💪' },
  { value: 'oral', label: '口腔', icon: '👄' },
  { value: 'rectal', label: '直肠', icon: '🌡️' }
]

// 常用药品
const commonMedicines = ['美林', '泰诺林', '小儿氨酚黄那敏颗粒', '布洛芬']

// 单位选项
const units = ['ml', 'mg', '片', '袋']

// 症状选项
const symptomOptions = [
  { value: 'fever', label: '发热' },
  { value: 'cough', label: '咳嗽' },
  { value: 'runny_nose', label: '流涕' },
  { value: 'sore_throat', label: '咽痛' },
  { value: 'vomiting', label: '呕吐' },
  { value: 'diarrhea', label: '腹泻' }
]

// 严重程度
const severityLevels = [
  { value: 'mild', label: '轻微', color: '#52C41A' },
  { value: 'moderate', label: '中等', color: '#FAAD14' },
  { value: 'severe', label: '严重', color: '#FF4D4F' }
]

// 体温表单
const temperatureForm = reactive({
  temperature: '',
  measurePart: 'ear',
  notes: ''
})

// 用药表单
const medicineForm = reactive({
  medicineName: '',
  dosage: '',
  unit: 'ml',
  notes: ''
})

// 症状表单
const symptomForm = reactive({
  symptoms: [] as string[],
  severity: 'mild',
  notes: ''
})

// 当前备注
const currentNotes = computed({
  get: () => {
    switch (activeTab.value) {
      case 'temperature':
        return temperatureForm.notes
      case 'medicine':
        return medicineForm.notes
      case 'symptom':
        return symptomForm.notes
      default:
        return ''
    }
  },
  set: (val) => {
    switch (activeTab.value) {
      case 'temperature':
        temperatureForm.notes = val
        break
      case 'medicine':
        medicineForm.notes = val
        break
      case 'symptom':
        symptomForm.notes = val
        break
    }
  }
})

/**
 * 切换症状选择
 */
function toggleSymptom(symptom: string) {
  const index = symptomForm.symptoms.indexOf(symptom)
  if (index === -1) {
    symptomForm.symptoms.push(symptom)
  } else {
    symptomForm.symptoms.splice(index, 1)
  }
}

/**
 * 关闭弹窗
 */
function handleClose() {
  emit('update:show', false)
  resetForms()
}

/**
 * 重置表单
 */
function resetForms() {
  activeTab.value = 'temperature'
  temperatureForm.temperature = ''
  temperatureForm.measurePart = 'ear'
  temperatureForm.notes = ''
  medicineForm.medicineName = ''
  medicineForm.dosage = ''
  medicineForm.unit = 'ml'
  medicineForm.notes = ''
  symptomForm.symptoms = []
  symptomForm.severity = 'mild'
  symptomForm.notes = ''
}

/**
 * 提交表单
 */
async function handleSubmit() {
  loading.value = true

  try {
    switch (activeTab.value) {
      case 'temperature':
        if (!temperatureForm.temperature) {
          uni.showToast({ title: '请输入体温', icon: 'none' })
          return
        }
        const temp = parseFloat(temperatureForm.temperature)
        if (isNaN(temp) || temp < 35 || temp > 42) {
          uni.showToast({ title: '体温范围应在35-42°C之间', icon: 'none' })
          return
        }
        healthStore.addTemperatureRecord({
          _id: Date.now().toString(),
          childId: '1',
          temperature: temp,
          measureTime: new Date().toISOString(),
          measurePart: temperatureForm.measurePart as any,
          notes: temperatureForm.notes,
          createTime: new Date().toISOString()
        })
        break

      case 'medicine':
        if (!medicineForm.medicineName) {
          uni.showToast({ title: '请输入药品名称', icon: 'none' })
          return
        }
        healthStore.addMedicineRecord({
          _id: Date.now().toString(),
          childId: '1',
          medicineId: '',
          medicineName: medicineForm.medicineName,
          dosage: medicineForm.dosage || '',
          unit: medicineForm.unit,
          takeTime: new Date().toISOString(),
          notes: medicineForm.notes,
          createTime: new Date().toISOString()
        })
        break

      case 'symptom':
        if (symptomForm.symptoms.length === 0) {
          uni.showToast({ title: '请至少选择一项症状', icon: 'none' })
          return
        }
        healthStore.addSymptomRecord({
          _id: Date.now().toString(),
          childId: '1',
          symptoms: symptomForm.symptoms,
          severity: symptomForm.severity as any,
          recordTime: new Date().toISOString(),
          notes: symptomForm.notes,
          createTime: new Date().toISOString()
        })
        break
    }

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

.tab-bar {
  display: flex;
  gap: 20rpx;
  padding: 32rpx 48rpx;

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24rpx;
    background: #f5f5f5;
    border-radius: 20rpx;
    border: 4rpx solid transparent;
    transition: all 0.3s;

    &.active {
      background: rgba(74, 144, 226, 0.1);
      border-color: #4A90E2;
    }

    .tab-icon {
      font-size: 40rpx;
      margin-bottom: 8rpx;
    }

    .tab-text {
      font-size: 26rpx;
      color: #666;
    }
  }
}

.tab-content {
  padding: 0 48rpx;
}

.form-item {
  margin-bottom: 32rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
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

.quick-medicine {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12rpx;

  .quick-label {
    font-size: 24rpx;
    color: #999;
  }

  .quick-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
  }
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

.symptom-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .symptom-tag {
    padding: 16rpx 32rpx;
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
