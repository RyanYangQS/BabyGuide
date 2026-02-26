/**
 * 获取症状记录云函数
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

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
    let query = db.collection('symptom_records').where({
      _openid: openid,
      childId: childId
    })

    // 时间范围筛选
    if (startDate || endDate) {
      const timeCondition = {}
      if (startDate) timeCondition['>='] = new Date(startDate)
      if (endDate) timeCondition['<='] = new Date(endDate)
      query = query.where({
        recordTime: timeCondition
      })
    }

    // 获取总数
    const countResult = await query.count()

    // 分页获取记录
    const skip = (page - 1) * pageSize
    const recordsResult = await query
      .orderBy('recordTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    return {
      success: true,
      data: {
        list: recordsResult.data,
        total: countResult.total,
        page,
        pageSize
      }
    }
  } catch (err) {
    console.error('获取症状记录失败:', err)
    return {
      success: false,
      errMsg: err.message || '获取失败'
    }
  }
}
