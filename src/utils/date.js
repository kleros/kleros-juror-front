/**
 * Stringifies a date object in the preffered Kleros format, (dd.mm.yyyy).
 * @export
 * @param {Date} date The date object
 * @returns {string} The formatted string
 */
export function formatDateString(date) {
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}
