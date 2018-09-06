import Eth from 'ethjs'
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
