# 养娃不易小程序 - 技术方案(uni-app + 微信云开发)

## 一、技术栈选型

### 1.1 前端技术栈

#### 框架选择
- **框架**: uni-app (Vue 3 + TypeScript)
- **UI组件库**: uni-ui / uView UI
- **状态管理**: Pinia
- **图表库**: uCharts / ECharts for 微信小程序
- **开发工具**: HBuilderX

#### 为什么选择uni-app?
- ✅ Vue 3 Composition API,开发体验好
- ✅ 丰富的微信小程序插件
- ✅ 完善的中文文档
- ✅ HBuilderX开发工具优秀
- ✅ 针对微信小程序深度优化

### 1.2 后端技术栈

#### 微信云开发
- **数据库**: 云开发数据库(NoSQL)
- **云函数**: Node.js
- **云存储**: 云存储
- **定时触发器**: 云函数定时任务

#### 为什么选择微信云开发?
- ✅ 微信登录原生支持,无需企业认证
- ✅ 免费额度充足(2GB数据库 + 5GB存储)
- ✅ 无需服务器运维
- ✅ 自动扩容
- ✅ 与微信生态完美集成

---

## 二、项目结构

### 2.1 整体结构

```
baby-guide/
├── cloudfunctions/              # 云函数目录
│   ├── login/                  # 登录云函数
│   │   ├── index.js
│   │   └── package.json
│   ├── children/               # 儿童档案管理
│   │   ├── index.js
│   │   └── package.json
│   ├── temperature/            # 体温记录
│   │   ├── index.js
│   │   └── package.json
│   ├── medicine/               # 用药管理
│   │   ├── index.js
│   │   └── package.json
│   ├── symptom/                # 症状记录
│   │   ├── index.js
│   │   └── package.json
│   └── reminder/               # 定时提醒
│       ├── index.js
│       └── package.json
├── miniprogram/                # 小程序代码
│   ├── pages/                  # 页面
│   │   ├── index/             # 首页
│   │   │   ├── index.vue
│   │   │   ├── index.scss
│   │   │   └── index.json
│   │   ├── temperature/       # 体温记录
│   │   │   ├── index.vue      # 列表页
│   │   │   └── add.vue        # 添加页
│   │   ├── medicine/          # 用药管理
│   │   │   ├── index.vue
│   │   │   └── add.vue
│   │   ├── profile/           # 我的
│   │   │   ├── index.vue
│   │   │   ├── addChild.vue   # 添加儿童
│   │   │   └── childDetail.vue # 儿童详情
│   │   └── login/             # 登录
│   │       └── index.vue
│   ├── components/             # 组件
│   │   ├── TemperatureChart/  # 体温图表
│   │   ├── MedicineCard/      # 用药卡片
│   │   ├── ChildCard/         # 儿童卡片
│   │   └── QuickAddModal/     # 快速添加弹窗
│   ├── api/                   # API封装
│   │   ├── index.ts           # API统一出口
│   │   ├── children.ts        # 儿童档案API
│   │   ├── temperature.ts     # 体温记录API
│   │   ├── medicine.ts        # 用药管理API
│   │   └── symptom.ts         # 症状记录API
│   ├── store/                 # 状态管理
│   │   ├── index.ts           # Pinia入口
│   │   └── modules/
│   │       ├── user.ts        # 用户状态
│   │       ├── children.ts    # 儿童状态
│   │       └── app.ts         # 应用状态
│   ├── utils/                 # 工具函数
│   │   ├── request.ts         # 云函数请求封装
│   │   ├── storage.ts         # 本地存储
│   │   ├── validator.ts       # 数据验证
│   │   ├── date.ts            # 日期处理
│   │   └── medicine.ts        # 用药计算
│   ├── constants/             # 常量
│   │   ├── index.ts
│   │   ├── medicine.ts        # 药品信息
│   │   └── temperature.ts     # 体温标准
│   ├── types/                 # TypeScript类型
│   │   └── index.ts
│   ├── static/                # 静态资源
│   │   ├── images/
│   │   └── icons/
│   ├── App.vue                # 应用入口
│   ├── main.ts                # 主入口
│   ├── manifest.json          # 应用配置
│   └── pages.json             # 页面配置
├── project.config.json         # 项目配置
└── cloudfunctions.json         # 云函数配置
```

---

## 三、数据库设计

### 3.1 集合(表)设计

#### 用户表 (users)
```javascript
{
  _id: string,              // 自动生成
  openid: string,           // 微信openid
  unionid: string,          // 微信unionid(可选)
  nickName: string,         // 昵称
  avatarUrl: string,        // 头像
  phone: string,            // 手机号
  createTime: Date,         // 创建时间
  updateTime: Date          // 更新时间
}
```

#### 儿童档案表 (children)
```javascript
{
  _id: string,              // 自动生成
  userId: string,           // 所属用户ID
  name: string,             // 姓名
  gender: string,           // 性别: male/female
  birthday: Date,           // 出生日期
  bloodType: string,        // 血型: A/B/AB/O
  allergies: string,        // 过敏史
  avatarUrl: string,        // 头像URL
  isDefault: boolean,       // 是否默认儿童
  createTime: Date,         // 创建时间
  updateTime: Date          // 更新时间
}

// 索引
db.collection('children').createIndex({
  keys: { userId: 1 },
  name: 'userId_index'
})
```

#### 体温记录表 (temperature_records)
```javascript
{
  _id: string,              // 自动生成
  childId: string,          // 儿童ID
  userId: string,           // 用户ID
  temperature: number,      // 体温值
  measureTime: Date,        // 测量时间
  measurePart: string,      // 测量部位: axillary/oral/ear/rectal
  notes: string,            // 备注
  status: string,           // 状态: normal/low-fever/fever
  createTime: Date          // 创建时间
}

// 索引
db.collection('temperature_records').createIndex({
  keys: { childId: 1, measureTime: -1 },
  name: 'child_time_index'
})
```

#### 用药记录表 (medicine_records)
```javascript
{
  _id: string,              // 自动生成
  childId: string,          // 儿童ID
  userId: string,           // 用户ID
  medicineName: string,     // 药品名称
  genericName: string,      // 通用名
  dosage: string,           // 剂量
  takeTime: Date,           // 用药时间
  nextAvailableTime: Date,  // 下次可用时间
  notes: string,            // 备注
  createTime: Date          // 创建时间
}

// 索引
db.collection('medicine_records').createIndex({
  keys: { childId: 1, takeTime: -1 },
  name: 'child_time_index'
})
```

#### 症状记录表 (symptom_records)
```javascript
{
  _id: string,              // 自动生成
  childId: string,          // 儿童ID
  userId: string,           // 用户ID
  symptoms: string[],       // 症状类型数组
  description: string,      // 详细描述
  images: string[],         // 图片URL数组
  recordTime: Date,         // 记录时间
  createTime: Date          // 创建时间
}
```

#### 药品信息表 (medicines)
```javascript
{
  _id: string,              // 自动生成
  name: string,             // 药品名称
  genericName: string,      // 通用名
  minIntervalHours: number, // 最小间隔小时
  maxDailyCount: number,    // 每日最大次数
  minAgeMonths: number,     // 最小适用年龄(月)
  maxAgeMonths: number,     // 最大适用年龄(月)
  description: string,      // 说明
  createTime: Date          // 创建时间
}

// 初始数据
const medicines = [
  {
    name: '美林',
    genericName: '布洛芬',
    minIntervalHours: 4,
    maxDailyCount: 4,
    minAgeMonths: 6
  },
  {
    name: '泰诺林',
    genericName: '对乙酰氨基酚',
    minIntervalHours: 4,
    maxDailyCount: 4,
    minAgeMonths: 3
  }
]
```

#### 家庭成员表 (family_members)
```javascript
{
  _id: string,              // 自动生成
  familyId: string,         // 家庭ID
  userId: string,           // 用户ID
  role: string,             // 角色: father/mother/grandfather/grandmother
  permission: string,       // 权限: admin/view
  invitedBy: string,        // 邀请人ID
  createTime: Date          // 创建时间
}
```

### 3.2 数据库权限配置

```json
// database_rules.json
{
  "children": {
    ".read": "auth != null && data.userId == auth.openid",
    ".write": "auth != null && data.userId == auth.openid"
  },
  "temperature_records": {
    ".read": "auth != null && data.userId == auth.openid",
    ".write": "auth != null && data.userId == auth.openid"
  },
  "medicine_records": {
    ".read": "auth != null && data.userId == auth.openid",
    ".write": "auth != null && data.userId == auth.openid"
  }
}
```

---

## 四、云函数实现

### 4.1 登录云函数

```javascript
// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 查询用户是否存在
    const userResult = await db.collection('users')
      .where({
        openid: wxContext.OPENID
      })
      .get()
    
    let user = null
    
    if (userResult.data.length === 0) {
      // 新用户,创建记录
      const result = await db.collection('users').add({
        data: {
          openid: wxContext.OPENID,
          unionid: wxContext.UNIONID || '',
          nickName: event.nickName || '',
          avatarUrl: event.avatarUrl || '',
          phone: '',
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })
      
      user = {
        _id: result._id,
        openid: wxContext.OPENID,
        isNewUser: true
      }
    } else {
      // 老用户,更新信息
      user = userResult.data[0]
      await db.collection('users').doc(user._id).update({
        data: {
          updateTime: db.serverDate()
        }
      })
    }
    
    return {
      success: true,
      data: user
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      errMsg: err.message
    }
  }
}
```

### 4.2 儿童档案云函数

```javascript
// cloudfunctions/children/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  
  switch (action) {
    case 'add':
      return await addChild(data, wxContext.OPENID)
    case 'update':
      return await updateChild(data, wxContext.OPENID)
    case 'delete':
      return await deleteChild(data, wxContext.OPENID)
    case 'list':
      return await getChildren(wxContext.OPENID)
    case 'detail':
      return await getChildDetail(data, wxContext.OPENID)
    default:
      return { success: false, errMsg: '无效的操作' }
  }
}

// 添加儿童
async function addChild(data, openid) {
  try {
    // 如果是第一个儿童,设为默认
    const countResult = await db.collection('children')
      .where({ userId: openid })
      .count()
    
    const isDefault = countResult.total === 0
    
    const result = await db.collection('children').add({
      data: {
        ...data,
        userId: openid,
        isDefault,
        createTime: db.serverDate(),
        updateTime: db.serverDate()
      }
    })
    
    return {
      success: true,
      data: { _id: result._id }
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}

// 获取儿童列表
async function getChildren(openid) {
  try {
    const result = await db.collection('children')
      .where({ userId: openid })
      .orderBy('createTime', 'desc')
      .get()
    
    return {
      success: true,
      data: result.data
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}

// 更新儿童
async function updateChild(data, openid) {
  try {
    const { _id, ...updateData } = data
    
    await db.collection('children').doc(_id).update({
      data: {
        ...updateData,
        updateTime: db.serverDate()
      }
    })
    
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}

// 删除儿童
async function deleteChild(data, openid) {
  try {
    const { childId } = data
    
    // 删除儿童档案
    await db.collection('children').doc(childId).remove()
    
    // 删除相关记录
    await db.collection('temperature_records')
      .where({ childId, userId: openid })
      .remove()
    
    await db.collection('medicine_records')
      .where({ childId, userId: openid })
      .remove()
    
    await db.collection('symptom_records')
      .where({ childId, userId: openid })
      .remove()
    
    return {
      success: true
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}
```

### 4.3 体温记录云函数

```javascript
// cloudfunctions/temperature/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  
  switch (action) {
    case 'add':
      return await addTemperature(data, wxContext.OPENID)
    case 'list':
      return await getTemperatures(data, wxContext.OPENID)
    case 'stats':
      return await getTemperatureStats(data, wxContext.OPENID)
    default:
      return { success: false, errMsg: '无效的操作' }
  }
}

// 添加体温记录
async function addTemperature(data, openid) {
  try {
    // 判断体温状态
    let status = 'normal'
    if (data.temperature >= 39) {
      status = 'fever'
    } else if (data.temperature >= 37.3) {
      status = 'low-fever'
    }
    
    const result = await db.collection('temperature_records').add({
      data: {
        ...data,
        userId: openid,
        status,
        createTime: db.serverDate()
      }
    })
    
    return {
      success: true,
      data: { _id: result._id, status }
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}

// 获取体温记录
async function getTemperatures(data, openid) {
  try {
    const { childId, startDate, endDate, limit = 100 } = data
    
    let query = db.collection('temperature_records')
      .where({
        childId,
        userId: openid
      })
    
    if (startDate) {
      query = query.where({
        measureTime: db.command.gte(new Date(startDate))
      })
    }
    
    if (endDate) {
      query = query.where({
        measureTime: db.command.lte(new Date(endDate))
      })
    }
    
    const result = await query
      .orderBy('measureTime', 'desc')
      .limit(limit)
      .get()
    
    return {
      success: true,
      data: result.data
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}

// 获取体温统计
async function getTemperatureStats(data, openid) {
  try {
    const { childId, days = 7 } = data
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const result = await db.collection('temperature_records')
      .where({
        childId,
        userId: openid,
        measureTime: db.command.gte(startDate)
      })
      .orderBy('measureTime', 'desc')
      .get()
    
    const temperatures = result.data.map(r => r.temperature)
    
    const stats = {
      max: temperatures.length > 0 ? Math.max(...temperatures) : 0,
      min: temperatures.length > 0 ? Math.min(...temperatures) : 0,
      avg: temperatures.length > 0 
        ? (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)
        : 0,
      count: temperatures.length
    }
    
    return {
      success: true,
      data: stats
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}
```

### 4.4 用药管理云函数

```javascript
// cloudfunctions/medicine/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()
  
  switch (action) {
    case 'add':
      return await addMedicine(data, wxContext.OPENID)
    case 'check':
      return await checkMedicine(data, wxContext.OPENID)
    case 'list':
      return await getMedicines(data, wxContext.OPENID)
    case 'info':
      return await getMedicineInfo()
    default:
      return { success: false, errMsg: '无效的操作' }
  }
}

// 检查用药间隔
async function checkMedicine(data, openid) {
  try {
    const { childId, medicineName } = data
    
    // 获取药品信息
    const medicineResult = await db.collection('medicines')
      .where({ name: medicineName })
      .get()
    
    if (medicineResult.data.length === 0) {
      return {
        success: false,
        errMsg: '药品信息不存在'
      }
    }
    
    const medicine = medicineResult.data[0]
    
    // 获取最近24小时的用药记录
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const recordsResult = await db.collection('medicine_records')
      .where({
        childId,
        userId: openid,
        medicineName,
        takeTime: _.gte(twentyFourHoursAgo)
      })
      .orderBy('takeTime', 'desc')
      .get()
    
    const recentRecords = recordsResult.data
    
    // 检查24小时用药次数
    if (recentRecords.length >= medicine.maxDailyCount) {
      return {
        success: true,
        data: {
          canTake: false,
          reason: `24小时内已用药${recentRecords.length}次,已达上限`,
          nextAvailableTime: null
        }
      }
    }
    
    // 检查用药间隔
    if (recentRecords.length > 0) {
      const lastRecord = recentRecords[0]
      const lastTakeTime = new Date(lastRecord.takeTime)
      const nextAvailableTime = new Date(
        lastTakeTime.getTime() + medicine.minIntervalHours * 60 * 60 * 1000
      )
      
      if (new Date() < nextAvailableTime) {
        return {
          success: true,
          data: {
            canTake: false,
            reason: '距离下次用药还需等待',
            nextAvailableTime: nextAvailableTime.getTime()
          }
        }
      }
    }
    
    return {
      success: true,
      data: {
        canTake: true,
        nextAvailableTime: null
      }
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}

// 添加用药记录
async function addMedicine(data, openid) {
  try {
    const { childId, medicineName, dosage, takeTime, notes } = data
    
    // 先检查用药间隔
    const checkResult = await checkMedicine({ childId, medicineName }, openid)
    
    if (!checkResult.data.canTake) {
      return {
        success: false,
        errMsg: checkResult.data.reason
      }
    }
    
    // 获取药品信息
    const medicineResult = await db.collection('medicines')
      .where({ name: medicineName })
      .get()
    
    const medicine = medicineResult.data[0]
    
    // 计算下次可用时间
    const nextAvailableTime = new Date(
      new Date(takeTime).getTime() + medicine.minIntervalHours * 60 * 60 * 1000
    )
    
    // 插入记录
    const result = await db.collection('medicine_records').add({
      data: {
        childId,
        userId: openid,
        medicineName,
        genericName: medicine.genericName,
        dosage,
        takeTime: new Date(takeTime),
        nextAvailableTime,
        notes,
        createTime: db.serverDate()
      }
    })
    
    return {
      success: true,
      data: {
        _id: result._id,
        nextAvailableTime: nextAvailableTime.getTime()
      }
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}

// 获取用药记录
async function getMedicines(data, openid) {
  try {
    const { childId, limit = 50 } = data
    
    const result = await db.collection('medicine_records')
      .where({
        childId,
        userId: openid
      })
      .orderBy('takeTime', 'desc')
      .limit(limit)
      .get()
    
    return {
      success: true,
      data: result.data
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}

// 获取药品信息
async function getMedicineInfo() {
  try {
    const result = await db.collection('medicines').get()
    
    return {
      success: true,
      data: result.data
    }
  } catch (err) {
    return {
      success: false,
      errMsg: err.message
    }
  }
}
```

### 4.5 定时提醒云函数

```javascript
// cloudfunctions/reminder/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const now = new Date()
    
    // 查询需要提醒的用药记录
    const result = await db.collection('medicine_records')
      .where({
        nextAvailableTime: db.command.lte(now),
        reminded: db.command.neq(true)
      })
      .get()
    
    // 发送提醒
    for (const record of result.data) {
      // 发送订阅消息
      await cloud.openapi.subscribeMessage.send({
        touser: record.userId,
        page: 'pages/medicine/index',
        data: {
          thing1: { value: '用药提醒' },
          thing2: { value: `${record.medicineName}可以再次使用了` },
          time3: { value: now.toLocaleString() }
        },
        templateId: 'your_template_id'
      })
      
      // 标记已提醒
      await db.collection('medicine_records')
        .doc(record._id)
        .update({
          data: { reminded: true }
        })
    }
    
    return {
      success: true,
      data: { count: result.data.length }
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      errMsg: err.message
    }
  }
}
```

---

## 五、前端实现

### 5.1 API封装

```typescript
// miniprogram/api/index.ts
const cloud = wx.cloud

// 初始化云开发
cloud.init({
  env: 'your-env-id'
})

// 统一调用云函数
export async function callFunction(name: string, action: string, data?: any) {
  try {
    const result = await cloud.callFunction({
      name,
      data: { action, data }
    })
    
    return result.result as any
  } catch (err) {
    console.error('云函数调用失败:', err)
    throw err
  }
}

// API模块
export * from './children'
export * from './temperature'
export * from './medicine'
export * from './symptom'
```

```typescript
// miniprogram/api/children.ts
import { callFunction } from './index'

// 添加儿童
export function addChild(data: any) {
  return callFunction('children', 'add', data)
}

// 获取儿童列表
export function getChildren() {
  return callFunction('children', 'list')
}

// 更新儿童
export function updateChild(data: any) {
  return callFunction('children', 'update', data)
}

// 删除儿童
export function deleteChild(childId: string) {
  return callFunction('children', 'delete', { childId })
}

// 获取儿童详情
export function getChildDetail(childId: string) {
  return callFunction('children', 'detail', { childId })
}
```

```typescript
// miniprogram/api/temperature.ts
import { callFunction } from './index'

// 添加体温记录
export function addTemperature(data: any) {
  return callFunction('temperature', 'add', data)
}

// 获取体温记录
export function getTemperatures(data: any) {
  return callFunction('temperature', 'list', data)
}

// 获取体温统计
export function getTemperatureStats(data: any) {
  return callFunction('temperature', 'stats', data)
}
```

```typescript
// miniprogram/api/medicine.ts
import { callFunction } from './index'

// 添加用药记录
export function addMedicine(data: any) {
  return callFunction('medicine', 'add', data)
}

// 检查用药间隔
export function checkMedicine(data: any) {
  return callFunction('medicine', 'check', data)
}

// 获取用药记录
export function getMedicines(data: any) {
  return callFunction('medicine', 'list', data)
}

// 获取药品信息
export function getMedicineInfo() {
  return callFunction('medicine', 'info')
}
```

### 5.2 状态管理

```typescript
// miniprogram/store/modules/user.ts
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as any,
    openid: '',
    isLoggedIn: false
  }),
  
  actions: {
    setUserInfo(userInfo: any) {
      this.userInfo = userInfo
      this.openid = userInfo.openid
      this.isLoggedIn = true
    },
    
    clearUser() {
      this.userInfo = null
      this.openid = ''
      this.isLoggedIn = false
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: {
          getItem: (key: string) => wx.getStorageSync(key),
          setItem: (key: string, value: any) => wx.setStorageSync(key, value)
        }
      }
    ]
  }
})
```

```typescript
// miniprogram/store/modules/children.ts
import { defineStore } from 'pinia'
import { getChildren } from '@/api/children'

export const useChildrenStore = defineStore('children', {
  state: () => ({
    childrenList: [] as any[],
    currentChild: null as any
  }),
  
  actions: {
    async loadChildren() {
      const result = await getChildren()
      if (result.success) {
        this.childrenList = result.data
        
        // 设置默认儿童
        if (!this.currentChild && this.childrenList.length > 0) {
          const defaultChild = this.childrenList.find(c => c.isDefault)
          this.currentChild = defaultChild || this.childrenList[0]
        }
      }
      return result
    },
    
    setCurrentChild(child: any) {
      this.currentChild = child
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'children',
        storage: {
          getItem: (key: string) => wx.getStorageSync(key),
          setItem: (key: string, value: any) => wx.setStorageSync(key, value)
        }
      }
    ]
  }
})
```

### 5.3 页面示例

```vue
<!-- miniprogram/pages/index/index.vue -->
<template>
  <view class="index-page">
    <!-- 儿童档案卡片 -->
    <view class="child-card" :style="{ background: themeGradient }">
      <view class="child-info">
        <view class="child-avatar">{{ currentChild?.avatar || '👶' }}</view>
        <view class="child-details">
          <text class="child-name">{{ currentChild?.name || '未选择' }}</text>
          <text class="child-age">{{ getChildAge(currentChild) }}</text>
          <text class="child-status">{{ healthStatus }}</text>
        </view>
      </view>
    </view>
    
    <!-- 今日概览 -->
    <view class="overview-section">
      <view class="section-title">今日概览</view>
      <view class="overview-cards">
        <view class="overview-card temperature">
          <text class="value" :style="{ color: themeColor }">{{ todayTemperature || '--' }}℃</text>
          <text class="label">体温</text>
        </view>
        <view class="overview-card medicine">
          <text class="value">{{ todayMedicineCount }}次</text>
          <text class="label">用药</text>
        </view>
        <view class="overview-card symptom">
          <text class="value">{{ todaySymptomCount }}条</text>
          <text class="label">症状</text>
        </view>
      </view>
    </view>
    
    <!-- 快速记录 -->
    <view class="quick-actions">
      <view class="section-title">快速记录</view>
      <view class="action-buttons">
        <view class="action-btn" @click="goToTemperature">
          <text class="icon">🌡️</text>
          <text class="text">体温</text>
        </view>
        <view class="action-btn" @click="goToMedicine">
          <text class="icon">💊</text>
          <text class="text">用药</text>
        </view>
        <view class="action-btn" @click="goToSymptom">
          <text class="icon">📝</text>
          <text class="text">症状</text>
        </view>
      </view>
    </view>
    
    <!-- 最近记录 -->
    <view class="recent-records">
      <view class="section-title">最近记录</view>
      <view 
        v-for="record in recentRecords" 
        :key="record._id"
        class="record-item"
        :class="record.type"
      >
        <view class="record-header">
          <text class="record-type">{{ record.title }}</text>
          <text class="record-time">{{ formatTime(record.time) }}</text>
        </view>
        <text class="record-content">{{ record.content }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChildrenStore } from '@/store/modules/children'
import { getTemperatures, getTemperatureStats } from '@/api/temperature'
import { getMedicines } from '@/api/medicine'

const childrenStore = useChildrenStore()

const currentChild = computed(() => childrenStore.currentChild)

const todayTemperature = ref<number | null>(null)
const todayMedicineCount = ref(0)
const todaySymptomCount = ref(0)
const recentRecords = ref<any[]>([])

// 健康状态
const healthStatus = computed(() => {
  if (!todayTemperature.value) return '🟢 健康状态良好'
  if (todayTemperature.value >= 39) return '🔴 发热状态'
  if (todayTemperature.value >= 37.3) return '🟡 低热状态'
  return '🟢 健康状态良好'
})

// 主题色
const themeColor = computed(() => {
  if (!todayTemperature.value) return '#7ED321'
  if (todayTemperature.value >= 39) return '#D0021B'
  if (todayTemperature.value >= 37.3) return '#F5A623'
  return '#7ED321'
})

// 主题渐变
const themeGradient = computed(() => {
  if (!todayTemperature.value) return 'linear-gradient(135deg, #7ED321 0%, #9BE34D 100%)'
  if (todayTemperature.value >= 39) return 'linear-gradient(135deg, #D0021B 0%, #FF4D6A 100%)'
  if (todayTemperature.value >= 37.3) return 'linear-gradient(135deg, #F5A623 0%, #FFB84D 100%)'
  return 'linear-gradient(135deg, #7ED321 0%, #9BE34D 100%)'
})

// 加载数据
onMounted(async () => {
  await loadData()
})

async function loadData() {
  if (!currentChild.value) return
  
  // 获取今日体温
  const tempResult = await getTemperatures({
    childId: currentChild.value._id,
    startDate: new Date().setHours(0, 0, 0, 0),
    limit: 1
  })
  
  if (tempResult.success && tempResult.data.length > 0) {
    todayTemperature.value = tempResult.data[0].temperature
  }
  
  // 获取今日用药
  const medResult = await getMedicines({
    childId: currentChild.value._id
  })
  
  if (medResult.success) {
    const today = new Date().setHours(0, 0, 0, 0)
    todayMedicineCount.value = medResult.data.filter(
      (m: any) => new Date(m.takeTime).getTime() >= today
    ).length
  }
}

function getChildAge(child: any) {
  if (!child?.birthday) return ''
  const age = calculateAge(child.birthday)
  return `${age.years}岁${age.months}月`
}

function calculateAge(birthday: string) {
  const birth = new Date(birthday)
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  
  if (months < 0) {
    years--
    months += 12
  }
  
  return { years, months }
}

function formatTime(time: string) {
  const date = new Date(time)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}

function goToTemperature() {
  uni.navigateTo({ url: '/pages/temperature/add' })
}

function goToMedicine() {
  uni.navigateTo({ url: '/pages/medicine/add' })
}

function goToSymptom() {
  uni.navigateTo({ url: '/pages/symptom/add' })
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background: #F8F9FA;
  padding-bottom: 20rpx;
}

.child-card {
  margin: 32rpx;
  padding: 40rpx;
  border-radius: 32rpx;
  color: white;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.child-info {
  display: flex;
  align-items: center;
}

.child-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 64rpx;
  margin-right: 32rpx;
}

.child-details {
  flex: 1;
}

.child-name {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.child-age {
  display: block;
  font-size: 28rpx;
  opacity: 0.9;
  margin-bottom: 8rpx;
}

.child-status {
  display: block;
  font-size: 24rpx;
  opacity: 0.8;
}

.overview-section {
  margin: 0 32rpx 32rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
}

.overview-cards {
  display: flex;
  gap: 24rpx;
}

.overview-card {
  flex: 1;
  background: white;
  padding: 32rpx;
  border-radius: 24rpx;
  text-align: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.overview-card .value {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}

.overview-card .label {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.quick-actions {
  margin: 0 32rpx 32rpx;
}

.action-buttons {
  display: flex;
  gap: 24rpx;
}

.action-btn {
  flex: 1;
  background: white;
  padding: 40rpx 24rpx;
  border-radius: 24rpx;
  text-align: center;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.action-btn .icon {
  display: block;
  font-size: 64rpx;
  margin-bottom: 16rpx;
}

.action-btn .text {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
}

.recent-records {
  margin: 0 32rpx;
}

.record-item {
  background: white;
  padding: 32rpx;
  border-radius: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  position: relative;
  padding-left: 40rpx;
}

.record-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8rpx;
  border-radius: 24rpx 0 0 24rpx;
}

.record-item.temperature::before {
  background: #D0021B;
}

.record-item.medicine::before {
  background: #4A90E2;
}

.record-item.symptom::before {
  background: #F5A623;
}

.record-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
}

.record-type {
  font-size: 32rpx;
  font-weight: bold;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-content {
  font-size: 28rpx;
  color: #666;
}
</style>
```

---

## 六、配置文件

### 6.1 manifest.json

```json
{
  "name": "养娃不易",
  "appid": "__UNI__XXXXXXX",
  "description": "养娃不易小程序",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  "mp-weixin": {
    "appid": "your-wechat-appid",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "usingComponents": true,
    "permission": {
      "scope.userLocation": {
        "desc": "用于获取您的位置信息"
      }
    },
    "requiredPrivateInfos": [
      "chooseImage",
      "chooseVideo"
    ]
  }
}
```

### 6.2 pages.json

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页",
        "navigationBarBackgroundColor": "#FFFFFF",
        "navigationBarTextStyle": "black"
      }
    },
    {
      "path": "pages/temperature/index",
      "style": {
        "navigationBarTitleText": "体温记录"
      }
    },
    {
      "path": "pages/temperature/add",
      "style": {
        "navigationBarTitleText": "添加体温"
      }
    },
    {
      "path": "pages/medicine/index",
      "style": {
        "navigationBarTitleText": "用药管理"
      }
    },
    {
      "path": "pages/medicine/add",
      "style": {
        "navigationBarTitleText": "添加用药"
      }
    },
    {
      "path": "pages/profile/index",
      "style": {
        "navigationBarTitleText": "我的"
      }
    },
    {
      "path": "pages/profile/addChild",
      "style": {
        "navigationBarTitleText": "添加儿童"
      }
    },
    {
      "path": "pages/login/index",
      "style": {
        "navigationBarTitleText": "登录"
      }
    }
  ],
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#4A90E2",
    "backgroundColor": "#FFFFFF",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/icons/home.png",
        "selectedIconPath": "static/icons/home-active.png"
      },
      {
        "pagePath": "pages/temperature/index",
        "text": "体温",
        "iconPath": "static/icons/temperature.png",
        "selectedIconPath": "static/icons/temperature-active.png"
      },
      {
        "pagePath": "pages/medicine/index",
        "text": "用药",
        "iconPath": "static/icons/medicine.png",
        "selectedIconPath": "static/icons/medicine-active.png"
      },
      {
        "pagePath": "pages/profile/index",
        "text": "我的",
        "iconPath": "static/icons/profile.png",
        "selectedIconPath": "static/icons/profile-active.png"
      }
    ]
  },
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "养娃不易",
    "navigationBarBackgroundColor": "#FFFFFF",
    "backgroundColor": "#F8F9FA"
  }
}
```

### 6.3 project.config.json

```json
{
  "miniprogramRoot": "miniprogram/",
  "cloudfunctionRoot": "cloudfunctions/",
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": true,
    "coverView": true,
    "nodeModules": false,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "lazyloadPlaceholderEnable": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "useIsolateContext": true,
    "userConfirmedBundleSwitch": false,
    "packNpmManually": false,
    "packNpmRelationList": [],
    "minifyWXSS": true,
    "disableUseStrict": false,
    "showES6CompileOption": false,
    "useCompilerPlugins": [
      "typescript"
    ]
  },
  "appid": "your-wechat-appid",
  "projectname": "baby-guide",
  "description": "养娃不易小程序",
  "cloudfunctionTemplateRoot": "",
  "condition": {},
  "editorSetting": {
    "tabIndent": "insertSpaces",
    "tabSize": 2
  }
}
```

---

## 七、开发流程

### 7.1 环境准备

1. **安装HBuilderX**
   ```bash
   # 下载地址
   https://www.dcloud.io/hbuilderx.html
   
   # 选择标准版(含uni-app)
   ```

2. **安装微信开发者工具**
   ```bash
   # 下载地址
   https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   ```

3. **注册微信小程序**
   - 访问 https://mp.weixin.qq.com
   - 注册小程序账号
   - 获取AppID

### 7.2 创建项目

1. **创建uni-app项目**
   ```
   HBuilderX -> 文件 -> 新建 -> 项目
   选择: uni-app
   模板: Vue 3 + TypeScript
   项目名: baby-guide
   ```

2. **开通云开发**
   ```
   微信开发者工具 -> 云开发控制台
   创建云开发环境
   记录环境ID
   ```

3. **初始化云函数**
   ```bash
   # 在项目根目录
   cd cloudfunctions
   npm install
   ```

### 7.3 开发步骤

#### 第一步: 实现登录功能
```bash
# 1. 创建登录页面
pages/login/index.vue

# 2. 实现登录云函数
cloudfunctions/login/index.js

# 3. 测试登录
```

#### 第二步: 实现儿童档案管理
```bash
# 1. 创建儿童档案相关页面
pages/profile/addChild.vue
pages/profile/childDetail.vue

# 2. 实现儿童档案云函数
cloudfunctions/children/index.js

# 3. 测试功能
```

#### 第三步: 实现体温记录功能
```bash
# 1. 创建体温记录页面
pages/temperature/index.vue
pages/temperature/add.vue

# 2. 实现体温记录云函数
cloudfunctions/temperature/index.js

# 3. 实现体温图表组件
components/TemperatureChart/index.vue
```

#### 第四步: 实现用药管理功能
```bash
# 1. 创建用药管理页面
pages/medicine/index.vue
pages/medicine/add.vue

# 2. 实现用药管理云函数
cloudfunctions/medicine/index.js

# 3. 实现智能提醒
cloudfunctions/reminder/index.js
```

### 7.4 本地调试

```bash
# 1. 在HBuilderX中运行
运行 -> 运行到小程序模拟器 -> 微信开发者工具

# 2. 在微信开发者工具中调试
查看控制台日志
测试云函数
调试页面
```

### 7.5 上传发布

```bash
# 1. 构建生产版本
HBuilderX -> 发行 -> 小程序-微信

# 2. 在微信开发者工具中上传
上传代码 -> 填写版本号和备注

# 3. 提交审核
微信公众平台 -> 版本管理 -> 提交审核

# 4. 发布上线
审核通过后点击发布
```

---

## 八、成本估算

### 8.1 开发成本

| 项目 | 成本 | 说明 |
|------|------|------|
| 小程序注册 | 0元 | 个人开发者免费 |
| 云开发 | 0元 | 免费额度内 |
| 开发工具 | 0元 | HBuilderX免费 |
| **总成本** | **0元** | 完全免费 |

### 8.2 运营成本

#### 初期(0-1000用户)
- 数据库: 免费(2GB内)
- 存储: 免费(5GB内)
- 云函数: 免费(10万次/月)
- **总成本: 0元/月**

#### 中期(1000-5000用户)
- 数据库: 约50元/月
- 存储: 约20元/月
- 云函数: 约30元/月
- **总成本: 约100元/月**

---

## 九、开发计划

### 9.1 开发阶段

#### 第一阶段: 基础功能(2周)
- ✅ 项目初始化
- ✅ 云开发环境配置
- ✅ 用户登录
- ✅ 儿童档案管理
- ✅ 体温记录功能

#### 第二阶段: 核心功能(2周)
- ✅ 用药记录功能
- ✅ 智能用药提醒
- ✅ 体温曲线图表
- ✅ 症状记录功能

#### 第三阶段: 优化完善(1周)
- ✅ UI/UX优化
- ✅ 性能优化
- ✅ 错误处理
- ✅ 测试和调试

#### 第四阶段: 上线发布(1周)
- ✅ 代码审核
- ✅ 提交审核
- ✅ 发布上线
- ✅ 用户反馈收集

### 9.2 技术难点

1. **微信登录**
   - ✅ 云开发原生支持,简单

2. **体温图表**
   - ⚠️ 需要选择合适的图表库
   - 解决方案: uCharts / ECharts

3. **用药间隔计算**
   - ⚠️ 需要精确计算
   - 解决方案: 云函数实现

4. **定时提醒**
   - ✅ 云函数定时触发器

---

## 十、总结

### 10.1 技术方案优势

1. **✅ 完全免费起步**
   - 云开发免费额度充足
   - 个人开发者无成本压力

2. **✅ 开发效率高**
   - uni-app开发体验好
   - 云开发无需后端运维

3. **✅ 微信生态完美集成**
   - 微信登录原生支持
   - 订阅消息推送
   - 微信支付扩展

4. **✅ 功能完整**
   - 数据库、存储、云函数
   - 定时任务
   - 实时数据推送

5. **✅ 维护简单**
   - 无需服务器运维
   - 自动扩容
   - 监控告警完善

### 10.2 最终推荐

**技术栈**: uni-app + Vue 3 + TypeScript + 微信云开发

**核心优势**:
- ✅ 零成本起步
- ✅ 微信登录原生支持
- ✅ 开发效率最高
- ✅ 功能完整
- ✅ 维护简单

**开发周期**: 4-6周

**总成本**: 0元

---

## 十一、快速开始

### 11.1 创建项目

```bash
# 1. 打开HBuilderX
# 2. 文件 -> 新建 -> 项目
# 3. 选择 uni-app
# 4. 选择 Vue 3 + TypeScript
# 5. 项目名: baby-guide
```

### 11.2 配置云开发

```bash
# 1. 在微信开发者工具中打开项目
# 2. 点击"云开发"按钮
# 3. 创建云开发环境
# 4. 记录环境ID
# 5. 在项目中配置环境ID
```

### 11.3 开始开发

```bash
# 1. 创建云函数
右键 cloudfunctions -> 新建 Node.js 云函数

# 2. 创建页面
右键 pages -> 新建页面

# 3. 开始编码
# 4. 运行调试
运行 -> 运行到小程序模拟器 -> 微信开发者工具
```

---

这个技术方案完全免费,最适合个人开发者! 🎊
