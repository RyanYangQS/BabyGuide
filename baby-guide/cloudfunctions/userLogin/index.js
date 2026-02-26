/**
 * 用户登录云函数
 * 自动获取用户 openid，创建或更新用户记录
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const usersCollection = db.collection('users')

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let openid = wxContext.OPENID

  // 模拟器调试模式：如果没有 openid，使用测试 openid
  if (!openid) {
    console.log('模拟器模式：使用测试 openid')
    openid = 'test_openid_' + Date.now()
  }

  try {
    // 查询用户是否存在
    const userResult = await usersCollection.where({
      _openid: openid
    }).get()

    if (userResult.data.length > 0) {
      // 用户已存在，更新登录时间
      const user = userResult.data[0]
      await usersCollection.doc(user._id).update({
        data: {
          lastLoginTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })
      
      return {
        success: true,
        data: {
          user: user,
          isNewUser: false,
          isSimulator: !wxContext.OPENID
        }
      }
    } else {
      // 新用户，创建记录
      const newUser = {
        _openid: openid,
        createTime: db.serverDate(),
        updateTime: db.serverDate(),
        lastLoginTime: db.serverDate()
      }
      
      const result = await usersCollection.add({
        data: newUser
      })
      
      return {
        success: true,
        data: {
          user: {
            _id: result._id,
            ...newUser
          },
          isNewUser: true,
          isSimulator: !wxContext.OPENID
        }
      }
    }
  } catch (err) {
    console.error('登录失败:', err)
    return {
      success: false,
      errMsg: err.message || '登录失败'
    }
  }
}
