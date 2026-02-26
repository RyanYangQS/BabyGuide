/**
 * 添加用药记录云函数
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const { childId, medicineId, medicineName, dosage, unit, takeTime, notes } = event

  if (!childId || !medicineName) {
    return {
      success: false,
      errMsg: '参数不完整'
    }
  }

  try {
    const record = {
      _openid: openid,
      childId,
      medicineId: medicineId || '',
      medicineName,
      dosage: dosage || '',
      unit: unit || 'ml',
      takeTime: takeTime || new Date().toISOString(),
      notes: notes || '',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }

    const result = await db.collection('medicine_records').add({ data: record })

    return {
      success: true,
      data: {
        _id: result._id,
        ...record
      }
    }
  } catch (err) {
    console.error('添加用药记录失败:', err)
    return {
      success: false,
      errMsg: err.message || '添加失败'
    }
  }
}
