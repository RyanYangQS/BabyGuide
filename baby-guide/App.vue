<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { useChildrenStore } from './src/store/modules/children'
import { useUserStore } from './src/store/modules/user'

onLaunch(async () => {
  console.log('App Launch')
  
  // 初始化云开发
  if (!uni.cloud) {
    console.error('当前环境不支持云开发')
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
  
  // 检查是否之前已登录（从缓存读取）
  const userStore = useUserStore()
  const wasLoggedIn = userStore.checkLoginStatus()
  
  // 如果之前已登录，自动加载儿童列表
  if (wasLoggedIn) {
    const childrenStore = useChildrenStore()
    await childrenStore.fetchChildren()
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
