/**
 * 添加体温记录云函数
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const { childId, temperature, measureTime, measurePart, notes } = event

  if (!childId || temperature === undefined) {
    return {
      success: false,
      errMsg: '参数不完整'
    }
  }

  try {
    const record = {
      _openid: openid,
      childId,
      temperature: parseFloat(temperature),
      measureTime: measureTime || new Date().toISOString(),
      measurePart: measurePart || 'axillary',
      notes: notes || '',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }

    const result = await db.collection('temperature_records').add({
      data: record
    })

    return {
      success: true,
      data: {
        _id: result._id,
        ...record
      }
    }
  } catch (err) {
    console.error('添加体温记录失败:', err)
    return {
      success: false,
      errMsg: err.message || '添加失败'
    }
  }
}
