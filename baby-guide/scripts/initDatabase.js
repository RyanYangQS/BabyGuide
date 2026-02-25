/**
 * 数据库初始化脚本
 * 在微信开发者工具的云开发控制台中运行
 */

const db = wx.cloud.database()

// 创建集合的函数
async function createCollections() {
  const collections = [
    'users',
    'children', 
    'temperature_records',
    'medicine_records',
    'symptom_records',
    'medicines',
    'family_members'
  ]
  
  console.log('开始创建数据库集合...')
  
  for (const name of collections) {
    try {
      // 尝试创建集合
      await db.createCollection(name)
      console.log(`✅ 集合 ${name} 创建成功`)
    } catch (err: any) {
      if (err.errMsg?.includes('already exists')) {
        console.log(`⚠️ 集合 ${name} 已存在`)
      } else {
        console.error(`❌ 集合 ${name} 创建失败:`, err)
      }
    }
  }
  
  console.log('数据库集合创建完成!')
}

// 初始化药品数据
async function initMedicines() {
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
      description: '用于缓解儿童普通感冒及流行性感冒引起的发热、头痛、四肢酸痛、打喷嚏、流鼻涕、鼻塞、咽痛等症状',
      createTime: db.serverDate()
    }
  ]
  
  console.log('开始初始化药品数据...')
  
  for (const medicine of medicines) {
    try {
      // 检查是否已存在
      const existResult = await db.collection('medicines')
        .where({ name: medicine.name })
        .get()
      
      if (existResult.data.length === 0) {
        await db.collection('medicines').add({ data: medicine })
        console.log(`✅ 药品 ${medicine.name} 添加成功`)
      } else {
        console.log(`⚠️ 药品 ${medicine.name} 已存在`)
      }
    } catch (err) {
      console.error(`❌ 药品 ${medicine.name} 添加失败:`, err)
    }
  }
  
  console.log('药品数据初始化完成!')
}

// 执行初始化
async function init() {
  await createCollections()
  await initMedicines()
}

// 在云函数中调用
init()
