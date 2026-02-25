<template>
  <view class="child-switch-modal" v-if="show" @click="handleClose">
    <view class="modal-content" @click.stop>
      <view class="modal-header">
        <text class="modal-title">切换儿童</text>
        <view class="close-btn" @click="handleClose">
          <text>×</text>
        </view>
      </view>
      
      <view class="child-list">
        <view 
          class="child-item" 
          :class="{ active: child._id === currentChildId }"
          v-for="child in childrenList" 
          :key="child._id"
          @click="handleSelectChild(child)"
        >
          <view class="child-avatar">
            <text>{{ child.name.charAt(0) }}</text>
          </view>
          <view class="child-info">
            <text class="child-name">{{ child.name }}</text>
            <text class="child-meta">{{ formatAge(child.birthday) }} · {{ child.gender === 'male' ? '男' : '女' }}</text>
          </view>
          <view class="check-icon" v-if="child._id === currentChildId">
            <text>✓</text>
          </view>
        </view>
      </view>
      
      <view class="add-child-btn" @click="handleAddChild">
        <text class="add-icon">+</text>
        <text class="add-text">添加儿童</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChildrenStore } from '../store/modules/children'
import { formatAge } from '../utils/date'
import type { Child } from '../types'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'change', child: Child): void
}>()

const childrenStore = useChildrenStore()

const childrenList = computed(() => childrenStore.childrenList)
const currentChildId = computed(() => childrenStore.currentChild?._id)

function handleClose() {
  emit('update:show', false)
}

function handleSelectChild(child: Child) {
  childrenStore.setCurrentChild(child)
  emit('change', child)
  handleClose()
}

function handleAddChild() {
  handleClose()
  uni.navigateTo({ url: '/pages/profile/addChild' })
}
</script>

<style lang="scss" scoped>
.child-switch-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
}

.modal-content {
  width: 100%;
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
  
  .modal-title {
    font-size: 32rpx;
    font-weight: 700;
    color: #333;
  }
  
  .close-btn {
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    text {
      font-size: 40rpx;
      color: #999;
    }
  }
}

.child-list {
  max-height: 60vh;
  overflow-y: auto;
}

.child-item {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  
  &.active {
    background: rgba(74, 144, 226, 0.05);
  }
  
  .child-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
    
    text {
      font-size: 32rpx;
      color: #fff;
      font-weight: bold;
    }
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
  
  .check-icon {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    background: #4A90E2;
    display: flex;
    align-items: center;
    justify-content: center;
    
    text {
      font-size: 24rpx;
      color: #fff;
    }
  }
}

.add-child-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
  margin: 16rpx 32rpx;
  border: 2rpx dashed #ddd;
  border-radius: 16rpx;
  
  .add-icon {
    font-size: 32rpx;
    color: #4A90E2;
    margin-right: 8rpx;
  }
  
  .add-text {
    font-size: 28rpx;
    color: #4A90E2;
  }
}
</style>
