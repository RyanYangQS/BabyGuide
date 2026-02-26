/**
 * 获取儿童列表云函数
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const childrenCollection = db.collection('children')
const familyMembersCollection = db.collection('family_members')

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 获取用户关联的儿童ID
    const familyResult = await familyMembersCollection.where({
      _openid: openid
    }).get()

    if (familyResult.data.length === 0) {
      return {
        success: true,
        data: []
      }
    }

    // 获取儿童详情
    const childIds = familyResult.data.map(item => item.childId)
    const childrenResult = await childrenCollection.where({
      _id: db.command.in(childIds)
    }).get()

    return {
      success: true,
      data: childrenResult.data
    }
  } catch (err) {
    console.error('获取儿童列表失败:', err)
    return {
      success: false,
      errMsg: err.message || '获取失败'
    }
  }
}
