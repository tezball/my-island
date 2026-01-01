/**
 * Utility Functions
 *
 * Common utilities for formatting, validation, and data manipulation.
 */

// Currency formatting - standardized to Euro for Ireland market
const currencyFormatter = new Intl.NumberFormat('en-IE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/**
 * Format a number as Euro currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "€125" or "€125.50")
 */
export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

/**
 * Format a date for display
 * @param date - Date string or Date object
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date,
  options: {
    format?: 'short' | 'medium' | 'long' | 'full'
    includeTime?: boolean
    includeWeekday?: boolean
  } = {}
): string {
  const { format = 'medium', includeTime = false, includeWeekday = false } = options
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: format === 'short' ? 'short' : format === 'long' || format === 'full' ? 'long' : 'short',
    year: format === 'full' || format === 'long' ? 'numeric' : undefined,
  }

  if (includeWeekday) {
    formatOptions.weekday = format === 'short' ? 'short' : 'long'
  }

  if (includeTime) {
    formatOptions.hour = '2-digit'
    formatOptions.minute = '2-digit'
  }

  return dateObj.toLocaleDateString('en-IE', formatOptions)
}

/**
 * Format a date range
 * @param start - Start date
 * @param end - End date
 * @returns Formatted date range string
 */
export function formatDateRange(start: string | Date, end: string | Date): string {
  const startDate = typeof start === 'string' ? new Date(start) : start
  const endDate = typeof end === 'string' ? new Date(end) : end

  const sameMonth = startDate.getMonth() === endDate.getMonth()
  const sameYear = startDate.getFullYear() === endDate.getFullYear()

  if (sameMonth && sameYear) {
    // "15 - 20 Jan 2026"
    return `${startDate.getDate()} - ${formatDate(endDate, { format: 'short' })}`
  }

  if (sameYear) {
    // "15 Jan - 5 Feb"
    return `${formatDate(startDate, { format: 'short' })} - ${formatDate(endDate, { format: 'short' })}`
  }

  // "15 Dec 2025 - 5 Jan 2026"
  return `${formatDate(startDate, { format: 'medium' })} - ${formatDate(endDate, { format: 'medium' })}`
}

/**
 * Calculate number of nights between two dates
 * @param checkIn - Check-in date
 * @param checkOut - Check-out date
 * @returns Number of nights
 */
export function calculateNights(checkIn: string | Date, checkOut: string | Date): number {
  const start = typeof checkIn === 'string' ? new Date(checkIn) : checkIn
  const end = typeof checkOut === 'string' ? new Date(checkOut) : checkOut
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = dateObj.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffMs / (1000 * 60))

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (Math.abs(diffDays) >= 1) {
    return rtf.format(diffDays, 'day')
  }
  if (Math.abs(diffHours) >= 1) {
    return rtf.format(diffHours, 'hour')
  }
  return rtf.format(diffMinutes, 'minute')
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Generate initials from a name
 * @param name - Full name
 * @returns Initials (max 2 characters)
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Debounce a function
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns Whether email is valid
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

/**
 * Validate Irish phone number
 * @param phone - Phone number to validate
 * @returns Whether phone is valid
 */
export function isValidIrishPhone(phone: string): boolean {
  // Irish mobile: 08x xxx xxxx or +353 8x xxx xxxx
  const cleaned = phone.replace(/\s/g, '')
  return /^(\+353|0)8[0-9]{8}$/.test(cleaned)
}

/**
 * Generate a random ID
 * @returns Random UUID-like string
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Clamp a number between min and max
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Pluralize a word based on count
 * @param count - Number of items
 * @param singular - Singular form
 * @param plural - Plural form (optional, defaults to singular + 's')
 * @returns Pluralized string with count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural || singular + 's')
  return `${count} ${word}`
}

/**
 * Class name utility (like clsx/classnames)
 * @param classes - Class names or conditional objects
 * @returns Combined class string
 */
export function cn(
  ...classes: (string | undefined | null | false | Record<string, boolean>)[]
): string {
  return classes
    .flatMap(c => {
      if (!c) return []
      if (typeof c === 'string') return [c]
      return Object.entries(c)
        .filter(([, value]) => value)
        .map(([key]) => key)
    })
    .join(' ')
}
