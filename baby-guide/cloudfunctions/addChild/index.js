/**
 * 添加儿童档案云函数
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
  let openid = wxContext.OPENID

  // 模拟器调试模式：如果没有 openid，使用测试 openid
  if (!openid) {
    console.log('模拟器模式：使用测试 openid')
    openid = 'test_user_openid'
  }

  const { name, gender, birthday, bloodType, allergies, notes, avatar } = event

  if (!name) {
    return {
      success: false,
      errMsg: '姓名不能为空'
    }
  }

  try {
    // 创建儿童记录
    const childData = {
      name,
      gender: gender || 'male',
      birthday: birthday || '',
      bloodType: bloodType || '',
      allergies: allergies || [],
      notes: notes || '',
      avatar: avatar || '',
      createTime: db.serverDate(),
      updateTime: db.serverDate()
    }

    const childResult = await childrenCollection.add({
      data: childData
    })

    // 创建家庭成员关联
    await familyMembersCollection.add({
      data: {
        _openid: openid,
        childId: childResult._id,
        role: 'parent',
        createTime: db.serverDate()
      }
    })

    return {
      success: true,
      data: {
        _id: childResult._id,
        ...childData
      }
    }
  } catch (err) {
    console.error('添加儿童失败:', err)
    return {
      success: false,
      errMsg: err.message || '添加失败'
    }
  }
}
