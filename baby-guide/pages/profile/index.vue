<template>
  <view class="profile-page">
    <!-- 用户信息 -->
    <view class="user-card">
      <!-- 未登录状态 -->
      <view class="user-info" v-if="!isLoggedIn" @click="handleLoginClick">
        <view class="user-avatar">
          <text>微</text>
        </view>
        <view class="user-detail">
          <text class="user-name">点击登录</text>
          <text class="user-phone">使用微信账号登录</text>
        </view>
        <view class="user-arrow">
          <text>›</text>
        </view>
      </view>

      <!-- 已登录但未授权头像 -->
      <view class="user-info" v-else-if="isLoggedIn && !userInfo?.nickName">
        <view class="user-avatar">
          <text>👤</text>
        </view>
        <view class="user-detail">
          <text class="user-name">已登录</text>
          <text class="user-phone">点击获取头像和昵称</text>
        </view>
        <button 
          class="auth-btn" 
          open-type="chooseAvatar" 
          @chooseavatar="onChooseAvatar"
        >
          获取头像
        </button>
      </view>

      <!-- 已登录且已授权 -->
      <view class="user-info" v-else>
        <view class="user-avatar">
          <image v-if="userInfo?.avatarUrl" :src="userInfo.avatarUrl" mode="aspectFill"></image>
          <text v-else>👤</text>
        </view>
        <view class="user-detail">
          <text class="user-name">{{ userInfo?.nickName || '微信用户' }}</text>
          <text class="user-phone">已关联微信账号</text>
        </view>
        <view class="user-arrow" @click="handleLogout">
          <text>退出</text>
        </view>
      </view>
    </view>

    <!-- 儿童档案 -->
    <view class="children-section">
      <view class="section-header">
        <text class="section-title">儿童档案</text>
        <text class="section-add" @click="handleAddChild" v-if="isLoggedIn">+ 添加</text>
      </view>
      
      <!-- 未登录提示 -->
      <view class="login-tip" v-if="!isLoggedIn">
        <text class="login-icon">🔐</text>
        <text class="login-text">登录后查看儿童档案</text>
      </view>
      
      <!-- 儿童列表 -->
      <view class="children-list" v-else-if="childrenList.length > 0">
        <view 
          class="child-item" 
          v-for="child in childrenList" 
          :key="child._id"
          @click="handleChildClick(child)"
        >
          <view class="child-avatar">
            <text>{{ child.name.charAt(0) }}</text>
          </view>
          <view class="child-info">
            <text class="child-name">{{ child.name }}</text>
            <text class="child-meta">{{ formatAge(child.birthday) }} · {{ child.gender === 'male' ? '男' : '女' }}</text>
          </view>
          <text class="child-arrow">›</text>
        </view>
      </view>
      
      <!-- 空状态 -->
      <view class="empty-children" v-else>
        <text class="empty-icon">👶</text>
        <text class="empty-text">暂无儿童档案</text>
        <view class="btn-add" @click="handleAddChild">
          <text>添加儿童</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="handleMenuClick('family')">
        <view class="menu-left">
          <text class="menu-icon">👨‍👩‍👧</text>
          <text class="menu-text">家庭成员管理</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('reminder')">
        <view class="menu-left">
          <text class="menu-icon">⏰</text>
          <text class="menu-text">提醒设置</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('export')">
        <view class="menu-left">
          <text class="menu-icon">📊</text>
          <text class="menu-text">数据导出</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('feedback')">
        <view class="menu-left">
          <text class="menu-icon">💬</text>
          <text class="menu-text">意见反馈</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('about')">
        <view class="menu-left">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于我们</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <!-- 版本信息 -->
    <view class="version-info">
      <text>版本 1.0.0</text>
    </view>

    <!-- 登录弹窗 -->
    <view class="login-modal" v-if="showLoginModal">
      <view class="modal-mask" @click="showLoginModal = false"></view>
      <view class="modal-content">
        <text class="modal-title">微信登录</text>
        <text class="modal-desc">授权获取您的微信头像和昵称</text>
        <view class="modal-actions">
          <button 
            class="modal-btn primary" 
            open-type="getUserInfo" 
            @getuserinfo="onGetUserInfo"
          >
            授权登录
          </button>
          <button class="modal-btn" @click="showLoginModal = false">取消</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChildrenStore } from '../../src/store/modules/children'
import { useUserStore } from '../../src/store/modules/user'
import { formatAge } from '../../src/utils/date'
import type { Child } from '../../src/types'

const childrenStore = useChildrenStore()
const userStore = useUserStore()

const showLoginModal = ref(false)

// 登录状态
const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo)

// 儿童列表
const childrenList = computed(() => childrenStore.childrenList)

/**
 * 点击登录
 */
function handleLoginClick() {
  showLoginModal.value = true
}

/**
 * 获取用户信息回调
 */
async function onGetUserInfo(e: any) {
  console.log('获取用户信息:', e)
  
  if (e.detail.errMsg === 'getUserInfo:ok') {
    const { nickName, avatarUrl } = e.detail.userInfo
    
    // 先登录获取 openid
    uni.showLoading({ title: '登录中...', mask: true })
    const loginRes = await userStore.login()
    uni.hideLoading()
    
    if (loginRes.success) {
      // 更新用户信息
      userStore.updateUserInfo(nickName, avatarUrl)
      uni.showToast({ title: '登录成功', icon: 'success' })
      
      // 加载儿童列表
      await childrenStore.fetchChildren()
    } else {
      uni.showToast({ title: loginRes.errMsg || '登录失败', icon: 'none' })
    }
    
    showLoginModal.value = false
  } else {
    uni.showToast({ title: '需要授权才能登录', icon: 'none' })
  }
}

/**
 * 选择头像回调
 */
function onChooseAvatar(e: any) {
  console.log('选择头像:', e)
  const avatarUrl = e.detail.avatarUrl
  
  // 弹出输入昵称
  uni.showModal({
    title: '设置昵称',
    editable: true,
    placeholderText: '请输入昵称',
    success: (res) => {
      if (res.confirm && res.content) {
        userStore.updateUserInfo(res.content, avatarUrl)
        uni.showToast({ title: '设置成功', icon: 'success' })
      }
    }
  })
}

/**
 * 退出登录
 */
function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出登录', icon: 'success' })
      }
    }
  })
}

/**
 * 添加儿童
 */
function handleAddChild() {
  if (!isLoggedIn.value) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: '/pages/profile/addChild'
  })
}

/**
 * 点击儿童卡片
 */
function handleChildClick(child: Child) {
  childrenStore.setCurrentChild(child)
  uni.navigateTo({
    url: '/pages/profile/childDetail'
  })
}

/**
 * 菜单点击
 */
function handleMenuClick(type: string) {
  const menuMap: Record<string, string> = {
    family: '家庭成员管理',
    reminder: '提醒设置',
    export: '数据导出',
    feedback: '意见反馈',
    about: '关于我们'
  }
  
  uni.showToast({ title: `${menuMap[type]}开发中`, icon: 'none' })
}

onMounted(async () => {
  // 检查登录状态
  userStore.checkLoginStatus()
  
  // 如果已登录，加载儿童列表
  if (isLoggedIn.value) {
    await childrenStore.fetchChildren()
  }
})
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
}

// 用户信息
.user-card {
  background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);
  padding: 48rpx 32rpx;
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .user-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    color: #4A90E2;
    font-weight: bold;
    margin-right: 32rpx;
    overflow: hidden;
    
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  .user-detail {
    flex: 1;
  }
  
  .user-name {
    font-size: 40rpx;
    font-weight: 700;
    color: #fff;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .user-phone {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.85);
  }
  
  .user-arrow {
    text {
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
  
  .auth-btn {
    margin: 0;
    padding: 16rpx 32rpx;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 32rpx;
    font-size: 28rpx;
    color: #4A90E2;
    line-height: 1.5;
  }
}

// 儿童档案
.children-section {
  margin: 24rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  .section-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #333;
  }
  
  .section-add {
    font-size: 28rpx;
    color: #4A90E2;
  }
  
  // 登录提示
  .login-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80rpx 0;
    background: #fff;
    border-radius: 20rpx;
    
    .login-icon {
      font-size: 80rpx;
      margin-bottom: 24rpx;
    }
    
    .login-text {
      font-size: 28rpx;
      color: #999;
    }
  }
  
  .children-list {
    .child-item {
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 20rpx;
      padding: 24rpx;
      margin-bottom: 16rpx;
    }
    
    .child-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      color: #fff;
      font-weight: bold;
      margin-right: 24rpx;
    }
    
    .child-info {
      flex: 1;
    }
    
    .child-name {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 4rpx;
    }
    
    .child-meta {
      font-size: 24rpx;
      color: #999;
    }
    
    .child-arrow {
      font-size: 32rpx;
      color: #ccc;
    }
  }
  
  .empty-children {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 80rpx 0;
    background: #fff;
    border-radius: 20rpx;
    
    .empty-icon {
      font-size: 80rpx;
      margin-bottom: 24rpx;
    }
    
    .empty-text {
      font-size: 28rpx;
      color: #999;
      margin-bottom: 32rpx;
    }
    
    .btn-add {
      padding: 20rpx 48rpx;
      background: #4A90E2;
      border-radius: 48rpx;
      
      text {
        font-size: 28rpx;
        color: #fff;
      }
    }
  }
}

// 功能菜单
.menu-section {
  background: #fff;
  margin: 24rpx;
  border-radius: 24rpx;
  overflow: hidden;
  
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32rpx;
    border-bottom: 1rpx solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .menu-left {
    display: flex;
    align-items: center;
  }
  
  .menu-icon {
    font-size: 40rpx;
    margin-right: 20rpx;
  }
  
  .menu-text {
    font-size: 28rpx;
    color: #333;
  }
  
  .menu-arrow {
    font-size: 32rpx;
    color: #ccc;
  }
}

// 版本信息
.version-info {
  text-align: center;
  padding: 48rpx;
  
  text {
    font-size: 24rpx;
    color: #999;
  }
}

// 登录弹窗
.login-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  
  .modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    background: #fff;
    border-radius: 24rpx;
    padding: 48rpx;
    text-align: center;
  }
  
  .modal-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #333;
    display: block;
    margin-bottom: 16rpx;
  }
  
  .modal-desc {
    font-size: 28rpx;
    color: #999;
    display: block;
    margin-bottom: 48rpx;
  }
  
  .modal-actions {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
  }
  
  .modal-btn {
    margin: 0;
    padding: 24rpx 0;
    border-radius: 48rpx;
    font-size: 32rpx;
    background: #f5f5f5;
    color: #666;
    line-height: 1.5;
    
    &.primary {
      background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);
      color: #fff;
    }
  }
}
</style>
