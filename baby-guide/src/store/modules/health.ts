import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as api from '../../api'
import type { MedicineRecord, SymptomRecord, TemperatureRecord } from '../../types'
import { HealthStatus, getHealthStatus } from '../../utils/theme'

export const useHealthStore = defineStore('health', () => {
  const temperatureRecords = ref<TemperatureRecord[]>([])
  const medicineRecords = ref<MedicineRecord[]>([])
  const symptomRecords = ref<SymptomRecord[]>([])
  const currentHealthStatus = ref<HealthStatus>(HealthStatus.Healthy)
  const loading = ref(false)
  
  const latestTemperature = computed(() => {
    if (temperatureRecords.value.length === 0) return null
    return temperatureRecords.value[0]
  })
  
  const todayTemperatureRecords = computed(() => {
    const today = new Date().toDateString()
    return temperatureRecords.value.filter(
      record => new Date(record.measureTime).toDateString() === today
    )
  })
  
  const todayMedicineRecords = computed(() => {
    const today = new Date().toDateString()
    return medicineRecords.value.filter(
      record => new Date(record.takeTime).toDateString() === today
    )
  })
  
  function setTemperatureRecords(records: TemperatureRecord[]) {
    temperatureRecords.value = records.sort(
      (a, b) => new Date(b.measureTime).getTime() - new Date(a.measureTime).getTime()
    )
    if (records.length > 0) {
      const latest = records[0]
      currentHealthStatus.value = getHealthStatus(latest.temperature)
    }
  }
  
  async function fetchTemperatureRecords(childId: string, startDate?: string, endDate?: string) {
    loading.value = true
    const res = await api.getTemperatureRecords({ childId, startDate, endDate })
    loading.value = false
    
    if (res.success && res.data) {
      setTemperatureRecords(res.data.list)
    }
    return res
  }
  
  async function addTemperatureRecordApi(data: {
    childId: string
    temperature: number
    measureTime: string
    measurePart?: 'oral' | 'axillary' | 'rectal' | 'ear'
    notes?: string
  }) {
    const res = await api.addTemperature(data)
    
    if (res.success && res.data) {
      addTemperatureRecord(res.data as TemperatureRecord)
    }
    return res
  }
  
  function addTemperatureRecord(record: TemperatureRecord) {
    temperatureRecords.value.unshift(record)
    temperatureRecords.value.sort(
      (a, b) => new Date(b.measureTime).getTime() - new Date(a.measureTime).getTime()
    )
    currentHealthStatus.value = getHealthStatus(record.temperature)
  }
  
  function setMedicineRecords(records: MedicineRecord[]) {
    medicineRecords.value = records.sort(
      (a, b) => new Date(b.takeTime).getTime() - new Date(a.takeTime).getTime()
    )
  }
  
  async function fetchMedicineRecords(childId: string, startDate?: string, endDate?: string) {
    loading.value = true
    const res = await api.getMedicineRecords({ childId, startDate, endDate })
    loading.value = false
    
    if (res.success && res.data) {
      setMedicineRecords(res.data.list)
    }
    return res
  }
  
  async function addMedicineRecordApi(data: {
    childId: string
    medicineId?: string
    medicineName: string
    dosage?: string
    unit?: string
    takeTime: string
    notes?: string
  }) {
    const res = await api.addMedicineRecord(data)
    
    if (res.success && res.data) {
      addMedicineRecord(res.data as MedicineRecord)
    }
    return res
  }
  
  function addMedicineRecord(record: MedicineRecord) {
    medicineRecords.value.unshift(record)
  }
  
  function setSymptomRecords(records: SymptomRecord[]) {
    symptomRecords.value = records.sort(
      (a, b) => new Date(b.recordTime).getTime() - new Date(a.recordTime).getTime()
    )
  }
  
  async function fetchSymptomRecords(childId: string, startDate?: string, endDate?: string) {
    loading.value = true
    const res = await api.getSymptomRecords({ childId, startDate, endDate })
    loading.value = false
    
    if (res.success && res.data) {
      setSymptomRecords(res.data.list)
    }
    return res
  }
  
  async function addSymptomRecordApi(data: {
    childId: string
    symptoms: string[]
    severity?: 'mild' | 'moderate' | 'severe'
    recordTime: string
    notes?: string
  }) {
    const res = await api.addSymptomRecord(data)
    
    if (res.success && res.data) {
      addSymptomRecord(res.data as SymptomRecord)
    }
    return res
  }
  
  function addSymptomRecord(record: SymptomRecord) {
    symptomRecords.value.unshift(record)
  }
  
  async function fetchHealthOverview(childId: string) {
    loading.value = true
    const res = await api.getHealthOverview(childId)
    loading.value = false
    
    if (res.success && res.data) {
      const { latestTemperature, healthStatus } = res.data
      currentHealthStatus.value = healthStatus
      if (latestTemperature) {
        const exists = temperatureRecords.value.find(r => r._id === latestTemperature._id)
        if (!exists) {
          temperatureRecords.value.unshift(latestTemperature)
        }
      }
    }
    return res
  }
  
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
    loading,
    latestTemperature,
    todayTemperatureRecords,
    todayMedicineRecords,
    setTemperatureRecords,
    fetchTemperatureRecords,
    addTemperatureRecordApi,
    addTemperatureRecord,
    setMedicineRecords,
    fetchMedicineRecords,
    addMedicineRecordApi,
    addMedicineRecord,
    setSymptomRecords,
    fetchSymptomRecords,
    addSymptomRecordApi,
    addSymptomRecord,
    fetchHealthOverview,
    clearRecords
  }
})
