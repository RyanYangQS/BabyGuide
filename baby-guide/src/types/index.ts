// 儿童信息接口
export interface Child {
  _id: string
  name: string
  avatar: string
  gender: 'male' | 'female'
  birthday: string
  bloodType?: string
  allergies?: string[]
  notes?: string
  createTime: string
  updateTime: string
}

// 体温记录接口
export interface TemperatureRecord {
  _id: string
  childId: string
  temperature: number
  measureTime: string
  measurePart: 'oral' | 'axillary' | 'rectal' | 'ear'
  notes?: string
  createTime: string
}

// 用药记录接口
export interface MedicineRecord {
  _id: string
  childId: string
  medicineId: string
  medicineName: string
  dosage: string
  unit: string
  takeTime: string
  nextTakeTime?: string
  notes?: string
  createTime: string
}

// 症状记录接口
export interface SymptomRecord {
  _id: string
  childId: string
  symptoms: string[]
  severity: 'mild' | 'moderate' | 'severe'
  notes?: string
  recordTime: string
  createTime: string
}

// 药品信息接口
export interface Medicine {
  _id: string
  name: string
  genericName: string
  minIntervalHours: number
  maxDailyCount: number
  minAgeMonths: number
  description: string
  createTime: string
}

// 家庭成员接口
export interface FamilyMember {
  _id: string
  userId: string
  childId: string
  relation: string
  role: 'admin' | 'member'
  createTime: string
}

// 用户信息接口
export interface User {
  _id: string
  openid: string
  unionid?: string
  nickName: string
  avatarUrl: string
  phone?: string
  createTime: string
  updateTime: string
}

// 快速记录表单接口
export interface QuickRecordForm {
  temperature?: number
  medicineId?: string
  medicineName?: string
  dosage?: string
  symptoms?: string[]
  recordTime: string
  notes?: string
}

// API 响应接口
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  errMsg?: string
}
