/**
 * Stringifies a date object in the preffered Kleros format, (7.12.2017).
 * @export
 * @param {Date} date The date object
 * @returns {string} The formatted string
 */
export function formatDateString(date) {
  return date.toLocaleDateString().replace(/\//g, '.')
}
