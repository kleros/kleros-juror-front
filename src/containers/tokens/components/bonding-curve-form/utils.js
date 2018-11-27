import { toBN } from 'ethjs'

import { decimalStringToWeiBN } from '../../../../utils/number'

const SPREAD_FACTOR = toBN(997)
const SPREAD_DIVISOR = toBN(1000)

/** Given an input ETH amount and the state values of the bonding curve contract,
 *  compute the amount of PNK that can be brought using the same formula as the
 *  bonding curve contract. Note this duplicates the algorithm of the contract
 *  but we can't call the contract because that way the turnaround would be too
 *  slow for a responsive UI.
 *  @param {string} inputETH User input ETH amount in ETH (not Wei). May not be a valid number.
 *  @param {BigNumber} totalETH The amount of ETH reserve of the contract.
 *  @param {BigNumber} totalPNK The amount of PNK reserver of the contrac.
 *  @returns {string} The amount of PNK in wei.
 */
export function estimatePNK(inputETH, totalETH, totalPNK) {
  try {
    inputETH = decimalStringToWeiBN(inputETH)
  } catch (_) {
    return '0'
  }
  // convert all to BN from BigNumber
  totalETH = toBN(totalETH)
  totalPNK = toBN(totalPNK)

  return inputETH
    .mul(totalPNK)
    .mul(SPREAD_FACTOR)
    .div(totalETH.mul(SPREAD_DIVISOR).add(inputETH.mul(SPREAD_FACTOR)))
    .toString()
}

/** Given an input PNK amount and the state values of the bonding curve contract,
 *  compute the amount of ETH that the PNK is sold for using the same formula as
 *  the bonding curve contract. Note this duplicates the algorithm of the contract
 *  but we can't call the contract because that way the turnaround would be too
 *  slow for a responsive UI.
 *  @param {string} inputPNK User input PNK amount. May not be a valid number.
 *  @param {BigNumber} totalETH The amount of ETH reserve of the contract.
 *  @param {BigNumber} totalPNK The amount of PNK reserver of the contrac.
 *  @returns {string} The amount of ETH in wei.
 */
export function estimateETH(inputPNK, totalETH, totalPNK) {
  try {
    inputPNK = decimalStringToWeiBN(inputPNK)
  } catch (_) {
    return '0'
  }
  // convert all to BN from BigNumber
  totalETH = toBN(totalETH)
  totalPNK = toBN(totalPNK)

  return inputPNK
    .mul(totalETH)
    .mul(SPREAD_FACTOR)
    .div(totalPNK.mul(SPREAD_DIVISOR).add(inputPNK.mul(SPREAD_FACTOR)))
    .toString()
}
