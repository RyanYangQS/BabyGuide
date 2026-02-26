/**
 * 云函数调用封装
 * 统一处理云函数调用、错误处理、loading状态
 */

type CloudFunctionResult<T = any> = {
  success: boolean
  data?: T
  errMsg?: string
}

type CallFunctionOptions = {
  showLoading?: boolean
  loadingText?: string
  showError?: boolean
}

/**
 * 调用云函数基础方法
 */
async function callFunction<T = any>(
  name: string,
  data: Record<string, any> = {},
  options: CallFunctionOptions = {}
): Promise<CloudFunctionResult<T>> {
  const { showLoading = false, loadingText = '加载中...', showError = true } = options

  if (showLoading) {
    uni.showLoading({ title: loadingText, mask: true })
  }

  try {
    const result = await uni.cloud.callFunction({
      name,
      data
    })

    if (showLoading) {
      uni.hideLoading()
    }

    const res = result.result as CloudFunctionResult<T>

    if (!res.success && showError) {
      uni.showToast({
        title: res.errMsg || '请求失败',
        icon: 'none'
      })
    }

    return res
  } catch (err: any) {
    if (showLoading) {
      uni.hideLoading()
    }

    console.error(`云函数 ${name} 调用失败:`, err)

    if (showError) {
      uni.showToast({
        title: err.message || '网络错误',
        icon: 'none'
      })
    }

    return {
      success: false,
      errMsg: err.message || '网络错误'
    }
  }
}

// ==================== 用户相关 ====================

/**
 * 用户登录
 */
export function userLogin() {
  return callFunction('userLogin')
}

// ==================== 儿童档案相关 ====================

/**
 * 获取儿童列表
 */
export function getChildren() {
  return callFunction('getChildren')
}

/**
 * 添加儿童档案
 */
export function addChild(data: {
  name: string
  gender: 'male' | 'female'
  birthday: string
  bloodType?: string
  allergies?: string[]
  notes?: string
}) {
  return callFunction('addChild', data, { showLoading: true, loadingText: '添加中...' })
}

/**
 * 更新儿童信息
 */
export function updateChild(data: {
  childId: string
  name?: string
  gender?: 'male' | 'female'
  birthday?: string
  bloodType?: string
  allergies?: string[]
  notes?: string
  avatar?: string
}) {
  return callFunction('updateChild', data, { showLoading: true, loadingText: '保存中...' })
}

/**
 * 删除儿童档案
 */
export function deleteChild(childId: string) {
  return callFunction('deleteChild', { childId }, { showLoading: true, loadingText: '删除中...' })
}

// ==================== 体温记录相关 ====================

/**
 * 添加体温记录
 */
export function addTemperature(data: {
  childId: string
  temperature: number
  measureTime: string
  measurePart?: 'oral' | 'axillary' | 'rectal' | 'ear'
  notes?: string
}) {
  return callFunction('addTemperature', data, { showLoading: true, loadingText: '记录中...' })
}

/**
 * 获取体温记录
 */
export function getTemperatureRecords(data: {
  childId: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) {
  return callFunction('getTemperatureRecords', data)
}

// ==================== 用药记录相关 ====================

/**
 * 添加用药记录
 */
export function addMedicineRecord(data: {
  childId: string
  medicineId?: string
  medicineName: string
  dosage?: string
  unit?: string
  takeTime: string
  notes?: string
}) {
  return callFunction('addMedicineRecord', data, { showLoading: true, loadingText: '记录中...' })
}

/**
 * 获取用药记录
 */
export function getMedicineRecords(data: {
  childId: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) {
  return callFunction('getMedicineRecords', data)
}

// ==================== 症状记录相关 ====================

/**
 * 添加症状记录
 */
export function addSymptomRecord(data: {
  childId: string
  symptoms: string[]
  severity?: 'mild' | 'moderate' | 'severe'
  recordTime: string
  notes?: string
}) {
  return callFunction('addSymptomRecord', data, { showLoading: true, loadingText: '记录中...' })
}

/**
 * 获取症状记录
 */
export function getSymptomRecords(data: {
  childId: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}) {
  return callFunction('getSymptomRecords', data)
}

// ==================== 统计相关 ====================

/**
 * 获取健康概览
 */
export function getHealthOverview(childId: string) {
  return callFunction('getHealthOverview', { childId })
}

// ==================== 数据库初始化 ====================

/**
 * 初始化数据库
 */
export function initDatabase() {
  return callFunction('initDatabase', {}, { showLoading: true, loadingText: '初始化中...' })
}
