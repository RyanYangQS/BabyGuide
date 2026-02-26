/**
 * 获取儿童列表云函数
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID

  // 模拟器调试模式：如果没有 openid，使用测试 openid
  if (!openid) {
    console.log('模拟器模式：使用测试 openid')
    openid = 'test_user_openid'
  }

  try {
    // 获取用户关联的儿童ID
    const familyResult = await db.collection('family_members').where({
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
    const childrenResult = await db.collection('children').where({
      _id: _.in(childIds)
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
