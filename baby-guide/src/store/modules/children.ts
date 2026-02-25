import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Child } from '../types'

export const useChildrenStore = defineStore('children', () => {
  // 当前选中的儿童
  const currentChild = ref<Child | null>(null)
  
  // 儿童列表
  const childrenList = ref<Child[]>([])
  
  // 加载状态
  const loading = ref(false)
  
  /**
   * 设置当前儿童
   */
  function setCurrentChild(child: Child | null) {
    currentChild.value = child
    if (child) {
      uni.setStorageSync('currentChildId', child._id)
    } else {
      uni.removeStorageSync('currentChildId')
    }
  }
  
  /**
   * 设置儿童列表
   */
  function setChildrenList(list: Child[]) {
    childrenList.value = list
  }
  
  /**
   * 添加儿童到列表
   */
  function addChild(child: Child) {
    childrenList.value.push(child)
  }
  
  /**
   * 更新儿童信息
   */
  function updateChild(child: Child) {
    const index = childrenList.value.findIndex(c => c._id === child._id)
    if (index !== -1) {
      childrenList.value[index] = child
      if (currentChild.value?._id === child._id) {
        currentChild.value = child
      }
    }
  }
  
  /**
   * 删除儿童
   */
  function removeChild(childId: string) {
    childrenList.value = childrenList.value.filter(c => c._id !== childId)
    if (currentChild.value?._id === childId) {
      currentChild.value = childrenList.value[0] || null
    }
  }
  
  /**
   * 从本地存储恢复当前儿童
   */
  function restoreCurrentChild() {
    const currentChildId = uni.getStorageSync('currentChildId')
    if (currentChildId && childrenList.value.length > 0) {
      const child = childrenList.value.find(c => c._id === currentChildId)
      if (child) {
        currentChild.value = child
      } else if (childrenList.value.length > 0) {
        currentChild.value = childrenList.value[0]
      }
    } else if (childrenList.value.length > 0) {
      currentChild.value = childrenList.value[0]
    }
  }
  
  return {
    currentChild,
    childrenList,
    loading,
    setCurrentChild,
    setChildrenList,
    addChild,
    updateChild,
    removeChild,
    restoreCurrentChild
  }
})
