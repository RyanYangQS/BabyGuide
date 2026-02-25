import { ref, computed } from 'vue'

// 健康状态枚举
export enum HealthStatus {
  Healthy = 'healthy',
  LowFever = 'low-fever',
  Fever = 'fever'
}

// 主题配置
const themeConfig = {
  [HealthStatus.Healthy]: {
    primary: '#52C41A',
    light: '#F6FFED',
    border: '#B7EB8F',
    text: '健康'
  },
  [HealthStatus.LowFever]: {
    primary: '#FAAD14',
    light: '#FFFBE6',
    border: '#FFE58F',
    text: '低烧'
  },
  [HealthStatus.Fever]: {
    primary: '#FF4D4F',
    light: '#FFF2F0',
    border: '#FFCCC7',
    text: '发烧'
  }
}

// 当前主题状态
const currentTheme = ref<HealthStatus>(HealthStatus.Healthy)

/**
 * 根据体温获取健康状态
 * @param temperature 体温
 * @returns 健康状态
 */
export function getHealthStatus(temperature: number): HealthStatus {
  if (temperature >= 38.5) {
    return HealthStatus.Fever
  }
  if (temperature >= 37.3) {
    return HealthStatus.LowFever
  }
  return HealthStatus.Healthy
}

/**
 * 设置当前主题
 * @param status 健康状态
 */
export function setTheme(status: HealthStatus) {
  currentTheme.value = status
}

/**
 * 根据体温设置主题
 * @param temperature 体温
 */
export function setThemeByTemperature(temperature: number) {
  const status = getHealthStatus(temperature)
  setTheme(status)
}

/**
 * 获取当前主题配置
 */
export function useTheme() {
  const theme = computed(() => themeConfig[currentTheme.value])
  const status = computed(() => currentTheme.value)
  
  return {
    theme,
    status,
    setTheme,
    setThemeByTemperature,
    getHealthStatus
  }
}

/**
 * 获取主题样式
 * @param status 健康状态
 * @returns 主题样式对象
 */
export function getThemeStyle(status: HealthStatus) {
  const config = themeConfig[status]
  return {
    '--theme-primary': config.primary,
    '--theme-light': config.light,
    '--theme-border': config.border
  }
}

/**
 * 获取主题类名
 * @param status 健康状态
 * @returns 主题类名
 */
export function getThemeClass(status: HealthStatus): string {
  return `theme-${status}`
}
