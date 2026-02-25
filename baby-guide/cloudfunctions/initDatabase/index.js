/**
 * 数据库初始化云函数
 * 用于创建数据库集合和初始化基础数据
 */

const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const results = {
    collections: [],
    medicines: []
  }
  
  // 需要创建的集合列表
  const collections = [
    'users',
    'children',
    'temperature_records',
    'medicine_records',
    'symptom_records',
    'medicines',
    'family_members'
  ]
  
  // 创建集合
  for (const name of collections) {
    try {
      await db.createCollection(name)
      results.collections.push({ name, status: 'created' })
    } catch (err) {
      if (err.errMsg?.includes('already exists')) {
        results.collections.push({ name, status: 'exists' })
      } else {
        results.collections.push({ name, status: 'error', error: err.errMsg })
      }
    }
  }
  
  // 初始化药品数据
  const medicines = [
    {
      name: '美林',
      genericName: '布洛芬',
      minIntervalHours: 4,
      maxDailyCount: 4,
      minAgeMonths: 6,
      description: '布洛芬混悬液，用于儿童普通感冒或流感引起的发热',
      createTime: db.serverDate()
    },
    {
      name: '泰诺林',
      genericName: '对乙酰氨基酚',
      minIntervalHours: 4,
      maxDailyCount: 4,
      minAgeMonths: 3,
      description: '对乙酰氨基酚混悬液，用于儿童普通感冒或流感引起的发热',
      createTime: db.serverDate()
    },
    {
      name: '小儿氨酚黄那敏颗粒',
      genericName: '氨酚黄那敏',
      minIntervalHours: 6,
      maxDailyCount: 3,
      minAgeMonths: 1,
      description: '用于缓解儿童普通感冒及流行性感冒引起的发热、头痛、四肢酸痛等症状',
      createTime: db.serverDate()
    }
  ]
  
  for (const medicine of medicines) {
    try {
      const existResult = await db.collection('medicines')
        .where({ name: medicine.name })
        .get()
      
      if (existResult.data.length === 0) {
        await db.collection('medicines').add({ data: medicine })
        results.medicines.push({ name: medicine.name, status: 'added' })
      } else {
        results.medicines.push({ name: medicine.name, status: 'exists' })
      }
    } catch (err) {
      results.medicines.push({ name: medicine.name, status: 'error', error: err.errMsg })
    }
  }
  
  return {
    success: true,
    data: results
  }
}
