/**
 * Stringifies a date object in the preffered Kleros format, (dd.mm.yyyy).
 * @export
 * @param {Date} date The date object
 * @returns {string} The formatted string
 */
export function formatDateString(
  date,
  { withYear = false, withTime = true } = {}
) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  const dateString = [day, month, withYear === true ? year : null]
    .filter(v => v)
    .join('.')
  if (!withTime) return dateString

  let hours = date.getHours()
  const minutes = date.getMinutes()
  const amOrPm = hours >= 12 ? 'pm' : 'am'
  hours = amOrPm === 'pm' ? hours % 12 || 12 : hours

  return `${dateString} at ${hours}:${minutes} ${amOrPm}`
}
