import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '../api'

export interface User {
  userId: string
  openid: string
  isNewUser?: boolean
}

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const userInfo = ref<User | null>(null)
  const loading = ref(false)

  /**
   * 登录
   */
  async function login() {
    loading.value = true
    
    try {
      const res = await api.userLogin()
      
      if (res.success && res.data) {
        isLoggedIn.value = true
        userInfo.value = {
          userId: res.data.userId,
          openid: res.data.openid,
          isNewUser: res.data.isNewUser
        }
        
        // 保存登录状态
        uni.setStorageSync('isLoggedIn', true)
        uni.setStorageSync('userId', res.data.userId)
        
        return { success: true, isNewUser: res.data.isNewUser }
      } else {
        return { success: false, errMsg: res.errMsg }
      }
    } catch (err: any) {
      console.error('登录失败:', err)
      return { success: false, errMsg: err.message || '登录失败' }
    } finally {
      loading.value = false
    }
  }

  /**
   * 检查登录状态
   */
  function checkLoginStatus() {
    const loggedIn = uni.getStorageSync('isLoggedIn')
    const userId = uni.getStorageSync('userId')
    
    if (loggedIn && userId) {
      isLoggedIn.value = true
      userInfo.value = {
        userId,
        openid: ''
      }
      return true
    }
    return false
  }

  /**
   * 退出登录
   */
  function logout() {
    isLoggedIn.value = false
    userInfo.value = null
    uni.removeStorageSync('isLoggedIn')
    uni.removeStorageSync('userId')
  }

  return {
    isLoggedIn,
    userInfo,
    loading,
    login,
    checkLoginStatus,
    logout
  }
})
