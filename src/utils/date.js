import { MONTHS_ENUM, ORDINAL_INDICATOR_ENUM } from '../constants/date'

/**
 * Stringifies a date object into the preffered Kleros format, (dd.mm.yyyy).
 * @param {object} date - The date object.
 * @returns {string} - The formatted string.
 */
export function dateToString(
  date,
  { withYear = true, withTime = true, numericMonth = true } = {}
) {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()

  let dateString
  if (numericMonth)
    dateString = [day, month + 1, withYear === true ? year : null]
      .filter(v => v)
      .join('.')
  else {
    const dayStr = day.toString()
    dateString = `${MONTHS_ENUM[month]} ${day}${
      ORDINAL_INDICATOR_ENUM[dayStr[dayStr.length - 1]]
    }${withYear === true ? `, ${year}` : ''}`
  }

  if (!withTime) return dateString

  let hours = date.getHours()
  const minutes = date.getMinutes()
  const amOrPm = hours >= 12 ? 'pm' : 'am'
  hours = amOrPm === 'pm' ? hours % 12 || 12 : hours

  return `${dateString} at ${hours}:${minutes} ${amOrPm}`
}
