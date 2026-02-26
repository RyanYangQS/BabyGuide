import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '../../api'
import type { Child } from '../../types'

export const useChildrenStore = defineStore('children', () => {
  const currentChild = ref<Child | null>(null)
  const childrenList = ref<Child[]>([])
  const loading = ref(false)

  
  function setCurrentChild(child: Child | null) {
    currentChild.value = child
    if (child) {
      uni.setStorageSync('currentChildId', child._id)
    } else {
      uni.removeStorageSync('currentChildId')
    }
  }
  
  function setChildrenList(list: Child[]) {
    childrenList.value = list
  }
  
  async function fetchChildren() {
    loading.value = true
    const res = await api.getChildren()
    loading.value = false
    
    if (res.success && res.data) {
      childrenList.value = res.data
      restoreCurrentChild()
    }
    return res
  }
  
  async function addChildApi(data: {
    name: string
    gender: 'male' | 'female'
    birthday: string
    bloodType?: string
    allergies?: string[]
    notes?: string
  }) {
    const res = await api.addChild(data)
    
    if (res.success && res.data) {
      childrenList.value.push(res.data as Child)
      if (!currentChild.value) {
        setCurrentChild(res.data as Child)
      }
    }
    return res
  }
  
  function addChild(child: Child) {
    childrenList.value.push(child)
  }
  
  async function updateChildApi(data: {
    childId: string
    name?: string
    gender?: 'male' | 'female'
    birthday?: string
    bloodType?: string
    allergies?: string[]
    notes?: string
    avatar?: string
  }) {
    const res = await api.updateChild(data)
    
    if (res.success) {
      const index = childrenList.value.findIndex(c => c._id === data.childId)
      if (index !== -1) {
        Object.assign(childrenList.value[index], data)
        if (currentChild.value?._id === data.childId) {
          Object.assign(currentChild.value, data)
        }
      }
    }
    return res
  }
  
  function updateChild(child: Child) {
    const index = childrenList.value.findIndex(c => c._id === child._id)
    if (index !== -1) {
      childrenList.value[index] = child
      if (currentChild.value?._id === child._id) {
        currentChild.value = child
      }
    }
  }
  
  async function deleteChildApi(childId: string) {
    const res = await api.deleteChild(childId)
    
    if (res.success) {
      childrenList.value = childrenList.value.filter(c => c._id !== childId)
      if (currentChild.value?._id === childId) {
        currentChild.value = childrenList.value[0] || null
        if (currentChild.value) {
          uni.setStorageSync('currentChildId', currentChild.value._id)
        }
      }
    }
    return res
  }
  
  function removeChild(childId: string) {
    childrenList.value = childrenList.value.filter(c => c._id !== childId)
    if (currentChild.value?._id === childId) {
      currentChild.value = childrenList.value[0] || null
    }
  }
  
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
    fetchChildren,
    addChildApi,
    addChild,
    updateChildApi,
    updateChild,
    deleteChildApi,
    removeChild,
    restoreCurrentChild
  }
})
