<template>
  <view class="profile-page">
    <!-- 用户信息 -->
    <view class="user-card">
      <view class="user-info" @click="handleLogin">
        <view class="user-avatar">
          <text>{{ userInfo.name?.charAt(0) || '用' }}</text>
        </view>
        <view class="user-detail">
          <text class="user-name">{{ userInfo.name || '点击登录' }}</text>
          <text class="user-phone">{{ userInfo.phone || '登录后查看更多信息' }}</text>
        </view>
      </view>
    </view>

    <!-- 儿童档案 -->
    <view class="children-section">
      <view class="section-header">
        <text class="section-title">儿童档案</text>
        <text class="section-add" @click="handleAddChild">+ 添加</text>
      </view>
      
      <view class="children-list" v-if="childrenList.length > 0">
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
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useChildrenStore } from '../../src/store/modules/children'
import { formatAge } from '../../src/utils/date'
import type { Child } from '../../src/types'

const childrenStore = useChildrenStore()

// 用户信息（模拟）
const userInfo = ref({
  name: '',
  phone: ''
})

// 儿童列表 - 使用 store 中的数据
const childrenList = computed(() => childrenStore.childrenList)

/**
 * 登录
 */
function handleLogin() {
  uni.showToast({ title: '登录功能开发中', icon: 'none' })
}

/**
 * 添加儿童
 */
function handleAddChild() {
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

onMounted(() => {
  // 加载模拟数据 - 只初始化一个默认儿童
  if (childrenStore.childrenList.length === 0) {
    const mockChild: Child = {
      _id: '1',
      name: '小明',
      avatar: '',
      gender: 'male',
      birthday: '2022-06-15',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    }
    
    childrenStore.setChildrenList([mockChild])
    
    // 设置默认选中的儿童
    if (!childrenStore.currentChild) {
      childrenStore.setCurrentChild(mockChild)
    }
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
</style>
