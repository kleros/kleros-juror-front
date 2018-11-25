import Eth from 'ethjs'
import BigNumber from 'bignumber.js'

/**
 * Stringifies a number into the preffered Kleros percentage format.
 * @param {number} n - The number.
 * @returns {string} - The formatted string.
 */
export function numberToPercentage(n) {
  return `${(n * 100).toFixed(2)}%`
}

/**
 * Convert a Big Number object of an amount in WEI to a decimal string.
 * NOTE: Should never use decimal numbers (toNumber) as precession can be lost.
 * For all mathematical opperations convert back to a BN object. Decimal strings
 * are only used for display.
 * @param {object} bn - The Big Number object.
 * @returns {string} The amount represented as a decimal string
 */
export function weiBNToDecimalString(bn) {
  // WARNING web3 and ethjs use different BN libraries.
  return Eth.fromWei(bn, 'ether').toString()
}

/**
 * Converts a decimal string to a Big Number object.
 * @param {string} amount - The amount represented by a decimal string.
 * @returns {object} The Big Number object of the amount
 */
export function decimalStringToWeiBN(amount) {
  if (amount === '') return Eth.toBN(0) // to avoid errors on inputs return BN(0) for empty string
  return Eth.toWei(amount, 'ether')
}

/**
 * Truncate number to 4 significant figures if its integeral part has less than 4
 * digits. Otherwise truncate to integer.
 * @param {string} n - Input number.
 * @returns {string} - Truncated number with at least 4 significant figures.
 */
export function truncate(n) {
  // Pad the number so it has at least 4 significant figures.
  if (n.indexOf('.') === -1) n += '.'

  n += '0000'

  var count = 0
  var dot = false
  for (var i = 0; i < n.length; i++) {
    if (n[i] === '.') dot = true
    else if (n[i] !== '0' || count > 0)
      // Past leading zeros.
      count += 1

    if (count >= 4 && dot) break
  }
  // Remove trailing dot.
  if (n[i] === '.') i -= 1

  return n.slice(0, i + 1)
}

/**
 * Convert a fraction to a decimal number representation.
 * @param {BigNumber|string} numerator - The numerator.
 * @param {BibNumber|string} denominator - The denominator.
 * @returns {string} - The result.
 */
export function fractionToDecimal(numerator, denominator) {
  if (typeof numerator === 'string') numerator = new BigNumber(numerator)
  if (typeof denominator === 'string') denominator = new BigNumber(denominator)
  return numerator.div(denominator).toString(10)
}
