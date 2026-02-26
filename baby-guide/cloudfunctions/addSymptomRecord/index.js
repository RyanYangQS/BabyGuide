/**
 * 添加症状记录云函数
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID

  console.log('收到请求:', event)
  console.log('wxContext:', wxContext)

  // 模拟器调试模式
  if (!openid) {
    console.log('模拟器模式：使用测试 openid')
    openid = 'test_user_openid'
  }

  const { childId, symptoms, severity, recordTime, notes } = event

  console.log('参数:', { childId, symptoms, severity, recordTime, notes, openid })

  if (!childId) {
    return {
      success: false,
      errMsg: '儿童ID不能为空'
    }
  }

  if (!symptoms || symptoms.length === 0) {
    return {
      success: false,
      errMsg: '请选择至少一项症状'
    }
  }

  try {
    const record = {
      _openid: openid,
      childId,
      symptoms: symptoms,
      severity: severity || 'mild',
      recordTime: recordTime || new Date().toISOString(),
      notes: notes || '',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }

    console.log('准备插入记录:', record)

    const result = await db.collection('symptom_records').add({
      data: record
    })

    console.log('插入成功:', result)

    return {
      success: true,
      data: {
        _id: result._id,
        ...record
      }
    }
  } catch (err) {
    console.error('添加症状记录失败:', err)
    return {
      success: false,
      errMsg: err.message || '添加失败'
    }
  }
}
