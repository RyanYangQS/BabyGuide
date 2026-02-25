import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | number, format: string = 'YYYY-MM-DD HH:mm'): string {
  return dayjs(date).format(format)
}

/**
 * 获取相对时间
 * @param date 日期
 * @returns 相对时间字符串
 */
export function getRelativeTime(date: Date | string | number): string {
  return dayjs(date).fromNow()
}

/**
 * 计算年龄
 * @param birthday 生日
 * @returns 年龄对象
 */
export function calculateAge(birthday: string): { years: number; months: number; days: number } {
  const birth = dayjs(birthday)
  const now = dayjs()
  
  let years = now.year() - birth.year()
  let months = now.month() - birth.month()
  let days = now.date() - birth.date()
  
  if (days < 0) {
    months--
    days += dayjs(now).subtract(1, 'month').daysInMonth()
  }
  
  if (months < 0) {
    years--
    months += 12
  }
  
  return { years, months, days }
}

/**
 * 格式化年龄显示
 * @param birthday 生日
 * @returns 年龄字符串
 */
export function formatAge(birthday: string): string {
  const { years, months } = calculateAge(birthday)
  
  if (years === 0) {
    return `${months}个月`
  }
  
  if (months === 0) {
    return `${years}岁`
  }
  
  return `${years}岁${months}个月`
}

/**
 * 判断是否是今天
 * @param date 日期
 * @returns 是否是今天
 */
export function isToday(date: Date | string | number): boolean {
  return dayjs(date).isSame(dayjs(), 'day')
}

/**
 * 获取今天的日期字符串
 * @param format 格式
 * @returns 日期字符串
 */
export function getToday(format: string = 'YYYY-MM-DD'): string {
  return dayjs().format(format)
}

/**
 * 获取当前时间字符串
 * @param format 格式
 * @returns 时间字符串
 */
export function getCurrentTime(format: string = 'HH:mm'): string {
  return dayjs().format(format)
}
