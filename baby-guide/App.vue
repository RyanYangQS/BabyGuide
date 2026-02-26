<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { userLogin } from './src/api'
import { useChildrenStore } from './src/store/modules/children'

onLaunch(async () => {
  console.log('App Launch')
  
  // 初始化云开发
  if (!uni.cloud) {
    console.error('当前环境不支持云开发，请使用真机预览')
    return
  }
  
  try {
    uni.cloud.init({
      env: 'cloud1-4gc1m9gl2ae51c9c',
      traceUser: true
    })
    console.log('云开发初始化成功')
  } catch (err) {
    console.error('云开发初始化失败:', err)
    return
  }
  
  // 自动登录
  try {
    const res = await userLogin()
    if (res.success) {
      console.log('用户登录成功', res.data?.isNewUser ? '(新用户)' : '(老用户)')
      
      // 加载儿童列表
      const childrenStore = useChildrenStore()
      await childrenStore.fetchChildren()
    } else {
      console.error('登录失败:', res.errMsg)
    }
  } catch (err) {
    console.error('登录异常:', err)
  }
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* 自定义主题色 */
page {
  --primary-color: #4A90E2;
  --success-color: #52C41A;
  --warning-color: #FAAD14;
  --error-color: #FF4D4F;
  --info-color: #909399;
}
</style>
