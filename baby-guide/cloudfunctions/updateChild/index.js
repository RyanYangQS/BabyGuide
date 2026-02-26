/**
 * 更新儿童信息云函数
 */
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const childrenCollection = db.collection('children')

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const { childId, name, gender, birthday, bloodType, allergies, notes, avatar } = event

  if (!childId) {
    return {
      success: false,
      errMsg: '儿童ID不能为空'
    }
  }

  try {
    // 构建更新数据
    const updateData = {
      updateTime: db.serverDate()
    }

    if (name !== undefined) updateData.name = name
    if (gender !== undefined) updateData.gender = gender
    if (birthday !== undefined) updateData.birthday = birthday
    if (bloodType !== undefined) updateData.bloodType = bloodType
    if (allergies !== undefined) updateData.allergies = allergies
    if (notes !== undefined) updateData.notes = notes
    if (avatar !== undefined) updateData.avatar = avatar

    await childrenCollection.doc(childId).update({
      data: updateData
    })

    return {
      success: true,
      data: updateData
    }
  } catch (err) {
    console.error('更新儿童信息失败:', err)
    return {
      success: false,
      errMsg: err.message || '更新失败'
    }
  }
}
