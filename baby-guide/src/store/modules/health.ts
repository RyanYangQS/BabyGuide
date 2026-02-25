import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TemperatureRecord, MedicineRecord, SymptomRecord } from '../types'
import { HealthStatus, getHealthStatus } from '../../utils/theme'

export const useHealthStore = defineStore('health', () => {
  // 体温记录列表
  const temperatureRecords = ref<TemperatureRecord[]>([])
  
  // 用药记录列表
  const medicineRecords = ref<MedicineRecord[]>([])
  
  // 症状记录列表
  const symptomRecords = ref<SymptomRecord[]>([])
  
  // 当前健康状态
  const currentHealthStatus = ref<HealthStatus>(HealthStatus.Healthy)
  
  // 最新体温
  const latestTemperature = computed(() => {
    if (temperatureRecords.value.length === 0) return null
    return temperatureRecords.value[0]
  })
  
  // 今日体温记录
  const todayTemperatureRecords = computed(() => {
    const today = new Date().toDateString()
    return temperatureRecords.value.filter(
      record => new Date(record.measureTime).toDateString() === today
    )
  })
  
  // 今日用药记录
  const todayMedicineRecords = computed(() => {
    const today = new Date().toDateString()
    return medicineRecords.value.filter(
      record => new Date(record.takeTime).toDateString() === today
    )
  })
  
  /**
   * 设置体温记录
   */
  function setTemperatureRecords(records: TemperatureRecord[]) {
    temperatureRecords.value = records.sort(
      (a, b) => new Date(b.measureTime).getTime() - new Date(a.measureTime).getTime()
    )
    
    // 更新健康状态
    if (records.length > 0) {
      const latest = records[0]
      currentHealthStatus.value = getHealthStatus(latest.temperature)
    }
  }
  
  /**
   * 添加体温记录
   */
  function addTemperatureRecord(record: TemperatureRecord) {
    temperatureRecords.value.unshift(record)
    temperatureRecords.value.sort(
      (a, b) => new Date(b.measureTime).getTime() - new Date(a.measureTime).getTime()
    )
    
    // 更新健康状态
    currentHealthStatus.value = getHealthStatus(record.temperature)
  }
  
  /**
   * 设置用药记录
   */
  function setMedicineRecords(records: MedicineRecord[]) {
    medicineRecords.value = records.sort(
      (a, b) => new Date(b.takeTime).getTime() - new Date(a.takeTime).getTime()
    )
  }
  
  /**
   * 添加用药记录
   */
  function addMedicineRecord(record: MedicineRecord) {
    medicineRecords.value.unshift(record)
  }
  
  /**
   * 设置症状记录
   */
  function setSymptomRecords(records: SymptomRecord[]) {
    symptomRecords.value = records.sort(
      (a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime()
    )
  }
  
  /**
   * 添加症状记录
   */
  function addSymptomRecord(record: SymptomRecord) {
    symptomRecords.value.unshift(record)
  }
  
  /**
   * 清空所有记录
   */
  function clearRecords() {
    temperatureRecords.value = []
    medicineRecords.value = []
    symptomRecords.value = []
    currentHealthStatus.value = HealthStatus.Healthy
  }
  
  return {
    temperatureRecords,
    medicineRecords,
    symptomRecords,
    currentHealthStatus,
    latestTemperature,
    todayTemperatureRecords,
    todayMedicineRecords,
    setTemperatureRecords,
    addTemperatureRecord,
    setMedicineRecords,
    addMedicineRecord,
    setSymptomRecords,
    addSymptomRecord,
    clearRecords
  }
})
