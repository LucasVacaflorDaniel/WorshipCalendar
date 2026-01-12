export const format = (
  date: Date | number | string | null,
  pattern: string,
  options?: { locale?: string }
) => {
  if (date === null) return 'Invalid date'

  const d = new Date(date)

  if (isNaN(d.getTime())) {
    return 'Invalid date'
  }

  const locale = options?.locale ?? 'es-ES'

  if (pattern === 'd') {
    return String(d.getDate())
}

  // 📅 Formato largo en español
  if (pattern === "EEEE, d 'de' MMMM") {
    const text = d.toLocaleDateString(locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })

    return text.charAt(0).toUpperCase() + text.slice(1)
  }

    // mmmm yyyy → "septiembre 2026"
  if (pattern === 'mmmm yyyy') {
    const year = d.getFullYear()
    const month = d.toLocaleDateString(locale, { month: 'long' }).toLowerCase()

    return `${month} ${year}`
  }

  // mmmm de yyyy → "septiembre de 2026"

  if (pattern === "mmmm 'de' yyyy") {
    const year = d.getFullYear()
    const month = d.toLocaleDateString(locale, { month: 'long' }).toLowerCase()

    return `${month} de ${year}`
  }

  // MMMM yyyy → "SEPTIEMBRE 2026"

  if (pattern === 'MMMM yyyy') {
    const year = d.getFullYear()
    const month = d.toLocaleDateString(locale, { month: 'long' }).toUpperCase()

    return `${month} ${year}`
  }

  // MMMM de yyyy → "SEPTIEMBRE de 2026"

  if (pattern === "MMMM 'de' yyyy") {
    const year = d.getFullYear()
    const month = d.toLocaleDateString(locale, { month: 'long' }).toUpperCase()

    return `${month} de ${year}`
  }

  // mmm yyyy → "sep 2026"
  if (pattern === 'mmm yyyy') {
    const year = d.getFullYear()
    const month = d.toLocaleDateString(locale, { month: 'short' }).toLowerCase()

    return `${month} ${year}`
  }

  // MMM yyyy → "SEP 2026"

  if (pattern === 'MMM yyyy') {
    const year = d.getFullYear()
    const month = d.toLocaleDateString(locale, { month: 'short' }).toUpperCase()

    return `${month} ${year}`
  }

  // Formato ISO yyyy-MM-dd
  if (pattern === 'yyyy-MM-dd') {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // MMMM → "enero"
  if (pattern === 'MMMM') {
    return d.toLocaleDateString(locale, { month: 'long' })
  }

  // eeee → "lunes"
  if (pattern === 'eeee') {
    return d.toLocaleDateString(locale, { weekday: 'long' })
  }

  // eee → "lun"
  if (pattern === 'eee') {
    return d.toLocaleDateString(locale, { weekday: 'short' })
  }

  // dd → día con 2 dígitos (01, 02, ..., 31)
  if (pattern === 'dd') {
    return String(d.getDate()).padStart(2, '0')
  }

  return `Unsupported format: ${pattern}`
}

export const startOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), 1)

export const endOfMonth = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0)

export const addMonths = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, date.getDate())

export const subMonths = (date: Date, amount: number) =>
  addMonths(date, -amount)

export const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth()

export const isToday = (date: Date) => {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

type WeekOptions = {
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
}

export const startOfWeek = (
  date: Date,
  options: WeekOptions = {}
) => {
  const { weekStartsOn = 0 } = options
  const result = new Date(date)
  const day = result.getDay()
  const diff = (day - weekStartsOn + 7) % 7

  result.setDate(result.getDate() - diff)
  result.setHours(0, 0, 0, 0)

  return result
}

export const endOfWeek = (
  date: Date,
  options: WeekOptions = {}
) => {
  const start = startOfWeek(date, options)
  const result = new Date(start)

  result.setDate(start.getDate() + 6)
  result.setHours(23, 59, 59, 999)

  return result
}

type DateInterval = {
  start: Date
  end: Date
}

export const eachDayOfInterval = ({ start, end }: DateInterval, currentMonth?: Date) => {
  const days: {
    date: Date,
    isCurrentDay: boolean,
    isCurrentMonth: boolean,
  }[] = []
  const current = new Date(start)

  current.setHours(0, 0, 0, 0)

  while (current <= end) {
    days.push({
      date: new Date(current),
      isCurrentDay: isToday(current),
      isCurrentMonth: currentMonth
        ? isSameMonth(current, currentMonth)
        : isSameMonth(current, start),
    })
    current.setDate(current.getDate() + 1)
  }

  return days
}

export const getCalendarDays = (currentDate: Date) => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)

  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  return eachDayOfInterval(
    { start: calendarStart, end: calendarEnd },
    currentDate
  )
}

export const getDay = (date: Date | string): number => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.getDay()
}