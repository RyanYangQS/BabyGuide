/**
 * 删除儿童档案云函数
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
    // 删除家庭成员关联
    await db.collection('family_members').where({
      _openid: openid,
      childId: childId
    }).remove()

    // 删除相关记录
    await db.collection('temperature_records').where({ childId }).remove()
    await db.collection('medicine_records').where({ childId }).remove()
    await db.collection('symptom_records').where({ childId }).remove()

    // 删除儿童记录
    await db.collection('children').doc(childId).remove()

    return {
      success: true,
      data: null
    }
  } catch (err) {
    console.error('删除儿童失败:', err)
    return {
      success: false,
      errMsg: err.message || '删除失败'
    }
  }
}
