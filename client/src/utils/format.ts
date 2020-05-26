import dayjs from 'dayjs'

/**
 * 到今天的日期表述
 * @param {number} date
 */
function toToday(date: number | Date | undefined) {
  if (!date) return ''
  const today = dayjs().unix()
  const thatDay = dayjs(date).endOf('day').unix()

  const period = thatDay - today
  const day = Math.floor(Math.abs(period) / 60 / 60 / 24)
  const isFuture = period > 0

  if (day < 1) return isFuture ? '今天' : '昨天'
  if (day < 2) return isFuture ? '明天' : '前天'
  return `${day}天${isFuture ? '后' : '前'}`
}

export { toToday }
