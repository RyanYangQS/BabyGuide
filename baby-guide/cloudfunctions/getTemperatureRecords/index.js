/**
 * 获取体温记录云函数
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

  const { childId, startDate, endDate, page = 1, pageSize = 20 } = event

  if (!childId) {
    return {
      success: false,
      errMsg: '儿童ID不能为空'
    }
  }

  try {
    let query = db.collection('temperature_records').where({
      _openid: openid,
      childId: childId
    })

    // 时间范围筛选
    if (startDate || endDate) {
      const timeCondition = {}
      if (startDate) timeCondition['>='] = new Date(startDate)
      if (endDate) timeCondition['<='] = new Date(endDate)
      query = query.where({
        measureTime: timeCondition
      })
    }

    // 获取总数
    const countResult = await query.count()

    // 分页获取记录
    const skip = (page - 1) * pageSize
    const recordsResult = await query
      .orderBy('measureTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    // 计算统计信息
    let stats = null
    if (recordsResult.data.length > 0) {
      const temps = recordsResult.data.map(r => r.temperature)
      stats = {
        max: Math.max(...temps),
        min: Math.min(...temps),
        avg: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1)
      }
    }

    return {
      success: true,
      data: {
        list: recordsResult.data,
        total: countResult.total,
        page,
        pageSize,
        stats
      }
    }
  } catch (err) {
    console.error('获取体温记录失败:', err)
    return {
      success: false,
      errMsg: err.message || '获取失败'
    }
  }
}
