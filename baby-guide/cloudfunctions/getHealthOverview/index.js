/**
 * 获取健康概览云函数
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const { childId } = event

  if (!childId) {
    return {
      success: false,
      errMsg: '儿童ID不能为空'
    }
  }

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString()

    // 并行获取今日数据
    const [tempResult, medicineResult, symptomResult, latestTempResult] = await Promise.all([
      // 今日体温记录
      db.collection('temperature_records').where({
        _openid: openid,
        childId: childId,
        measureTime: _.gte(todayStr)
      }).count(),
      
      // 今日用药记录
      db.collection('medicine_records').where({
        _openid: openid,
        childId: childId,
        takeTime: _.gte(todayStr)
      }).count(),
      
      // 今日症状记录
      db.collection('symptom_records').where({
        _openid: openid,
        childId: childId,
        recordTime: _.gte(todayStr)
      }).count(),
      
      // 最新体温
      db.collection('temperature_records').where({
        _openid: openid,
        childId: childId
      }).orderBy('measureTime', 'desc').limit(1).get()
    ])

    // 计算健康状态
    let healthStatus = 'healthy'
    if (latestTempResult.data.length > 0) {
      const temp = latestTempResult.data[0].temperature
      if (temp >= 39) {
        healthStatus = 'fever'
      } else if (temp >= 37.3) {
        healthStatus = 'low-fever'
      }
    }

    return {
      success: true,
      data: {
        today: {
          temperatureCount: tempResult.total,
          medicineCount: medicineResult.total,
          symptomCount: symptomResult.total
        },
        latestTemperature: latestTempResult.data[0] || null,
        healthStatus
      }
    }
  } catch (err) {
    console.error('获取健康概览失败:', err)
    return {
      success: false,
      errMsg: err.message || '获取失败'
    }
  }
}
