/**
 * 用户登录云函数
 * 自动获取用户 openid，创建或更新用户记录
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
  const appid = wxContext.APPID
  const unionid = wxContext.UNIONID

  console.log('登录信息:', { openid, appid, unionid })

  // 真机环境必须有 openid
  if (!openid) {
    return {
      success: false,
      errMsg: '获取用户信息失败，请确保在微信环境中打开'
    }
  }

  try {
    const usersCollection = db.collection('users')
    
    // 查询用户是否存在
    const userResult = await usersCollection.where({
      _openid: openid
    }).get()

    const now = db.serverDate()

    if (userResult.data.length > 0) {
      // 用户已存在，更新登录时间
      const user = userResult.data[0]
      await usersCollection.doc(user._id).update({
        data: {
          lastLoginTime: now,
          updateTime: now,
          loginCount: _.inc(1)
        }
      })
      
      console.log('用户登录成功:', user._id)
      
      return {
        success: true,
        data: {
          userId: user._id,
          openid: openid,
          isNewUser: false
        }
      }
    } else {
      // 新用户，创建记录
      const newUserData = {
        _openid: openid,
        _unionid: unionid || '',
        createTime: now,
        updateTime: now,
        lastLoginTime: now,
        loginCount: 1
      }
      
      const result = await usersCollection.add({
        data: newUserData
      })
      
      console.log('新用户创建成功:', result._id)
      
      return {
        success: true,
        data: {
          userId: result._id,
          openid: openid,
          isNewUser: true
        }
      }
    }
  } catch (err) {
    console.error('登录失败:', err)
    return {
      success: false,
      errMsg: err.message || '登录失败，请重试'
    }
  }
}
