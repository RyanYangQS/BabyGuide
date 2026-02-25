<template>
  <view class="profile-page">
    <!-- 用户信息 -->
    <view class="user-section card">
      <view class="user-info">
        <image class="user-avatar" :src="userInfo.avatar || defaultAvatar" mode="aspectFill" />
        <view class="user-detail">
          <text class="user-name">{{ userInfo.name || '未登录' }}</text>
          <text class="user-desc">{{ userInfo.phone || '点击登录' }}</text>
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
          class="child-item card" 
          v-for="child in childrenList" 
          :key="child._id"
          @click="handleChildClick(child)"
        >
          <image class="child-avatar" :src="child.avatar || defaultAvatar" mode="aspectFill" />
          <view class="child-info">
            <text class="child-name">{{ child.name }}</text>
            <text class="child-meta">{{ formatAge(child.birthday) }} · {{ child.gender === 'male' ? '男' : '女' }}</text>
          </view>
          <text class="child-arrow">›</text>
        </view>
      </view>
      
      <view class="empty-children" v-else>
        <text class="empty-text">暂无儿童档案</text>
        <button class="btn-add" @click="handleAddChild">添加儿童</button>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section card">
      <view class="menu-item" @click="handleMenuClick('family')">
        <text class="menu-icon">👨‍👩‍👧</text>
        <text class="menu-text">家庭成员管理</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('reminder')">
        <text class="menu-icon">⏰</text>
        <text class="menu-text">提醒设置</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('export')">
        <text class="menu-icon">📊</text>
        <text class="menu-text">数据导出</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('feedback')">
        <text class="menu-icon">💬</text>
        <text class="menu-text">意见反馈</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-item" @click="handleMenuClick('about')">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useChildrenStore } from '../../src/store/modules/children'
import { formatAge } from '../../src/utils/date'
import type { Child } from '../../src/types'

const childrenStore = useChildrenStore()

const defaultAvatar = '/static/logo.png'

// 用户信息（模拟）
const userInfo = ref({
  name: '用户昵称',
  avatar: '',
  phone: ''
})

// 儿童列表
const childrenList = ref<Child[]>([])

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
  switch (type) {
    case 'family':
      uni.showToast({ title: '家庭成员管理', icon: 'none' })
      break
    case 'reminder':
      uni.showToast({ title: '提醒设置', icon: 'none' })
      break
    case 'export':
      uni.showToast({ title: '数据导出', icon: 'none' })
      break
    case 'feedback':
      uni.showToast({ title: '意见反馈', icon: 'none' })
      break
    case 'about':
      uni.showToast({ title: '关于我们', icon: 'none' })
      break
  }
}

onMounted(() => {
  // 加载模拟数据
  if (childrenList.value.length === 0) {
    const mockChildren: Child[] = [
      {
        _id: '1',
        name: '小明',
        avatar: '',
        gender: 'male',
        birthday: '2022-06-15',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      },
      {
        _id: '2',
        name: '小红',
        avatar: '',
        gender: 'female',
        birthday: '2023-03-20',
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString()
      }
    ]
    childrenList.value = mockChildren
    childrenStore.setChildrenList(mockChildren)
    
    // 设置默认选中的儿童
    if (!childrenStore.currentChild) {
      childrenStore.setCurrentChild(mockChildren[0])
    }
  }
})
</script>

<style lang="scss" scoped>
@import '../../src/styles/variables.scss';

.profile-page {
  min-height: 100vh;
  padding: $spacing-md;
}

// 用户信息
.user-section {
  margin-bottom: $spacing-lg;
  
  .user-info {
    display: flex;
    align-items: center;
  }
  
  .user-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    margin-right: $spacing-md;
  }
  
  .user-detail {
    flex: 1;
  }
  
  .user-name {
    font-size: $font-xl;
    font-weight: bold;
    color: $text-color;
    display: block;
    margin-bottom: 8rpx;
  }
  
  .user-desc {
    font-size: $font-sm;
    color: $text-secondary;
  }
}

// 儿童档案
.children-section {
  margin-bottom: $spacing-lg;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-md;
  }
  
  .section-title {
    font-size: $font-lg;
    font-weight: bold;
    color: $text-color;
  }
  
  .section-add {
    font-size: $font-md;
    color: $primary-color;
  }
  
  .children-list {
    .child-item {
      display: flex;
      align-items: center;
      margin-bottom: $spacing-md;
    }
    
    .child-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: $spacing-md;
    }
    
    .child-info {
      flex: 1;
    }
    
    .child-name {
      font-size: $font-md;
      font-weight: bold;
      color: $text-color;
      display: block;
      margin-bottom: 4rpx;
    }
    
    .child-meta {
      font-size: $font-sm;
      color: $text-secondary;
    }
    
    .child-arrow {
      font-size: $font-xl;
      color: $text-light;
    }
  }
  
  .empty-children {
    text-align: center;
    padding: $spacing-xl;
    
    .empty-text {
      font-size: $font-md;
      color: $text-light;
      display: block;
      margin-bottom: $spacing-md;
    }
    
    .btn-add {
      display: inline-block;
      padding: $spacing-sm $spacing-lg;
      background-color: $primary-color;
      color: #FFFFFF;
      font-size: $font-md;
      border-radius: $radius-full;
      border: none;
    }
  }
}

// 功能菜单
.menu-section {
  .menu-item {
    display: flex;
    align-items: center;
    padding: $spacing-md 0;
    border-bottom: 1rpx solid $border-color;
    
    &:last-child {
      border-bottom: none;
    }
    
    .menu-icon {
      font-size: 40rpx;
      margin-right: $spacing-md;
    }
    
    .menu-text {
      flex: 1;
      font-size: $font-md;
      color: $text-color;
    }
    
    .menu-arrow {
      font-size: $font-xl;
      color: $text-light;
    }
  }
}
</style>
