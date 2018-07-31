/**
 * Stringifies a number into the preffered Kleros percentage format.
 * @param {number} n - The number.
 * @returns {string} - The formatted string.
 */
export function numberToPercentage(n) {
  return `${(n * 100).toFixed(2)}%`
}
