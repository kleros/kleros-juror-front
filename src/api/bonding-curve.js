import { toBN, BN } from 'ethjs'
import ContractImplementation from 'kleros-api/lib/contracts/ContractImplementation'
import MiniMePinakion from 'kleros-api/lib/contracts/implementations/PNK/MiniMePinakion'

import { decimalStringToWeiBN } from '../utils/number'

import bondingCurveArtifact from './BondingCurve'

const SPREAD_DIVISOR = toBN(10000) // Must be kept in sync with the bonding curve contract

/** Given an input ETH amount and the state values of the bonding curve contract,
 *  compute the amount of PNK that can be brought using the same formula as the
 *  bonding curve contract. Note this duplicates the algorithm from the contract
 *  but we can't call the contract because that way the turnaround would be too
 *  slow for a responsive UI.
 *  @param {string} inputETH User input ETH amount in ETH (not Wei). May not be a valid number.
 *  @param {BigNumber} totalETH 'totalETH' value of the contract.
 *  @param {BigNumber} totalPNK 'totalPNK' value of the contract.
 *  @param {BigNumber} spread 'spread' value of the contract.
 *  @returns {string} Amount of PNK in wei.
 */
export function estimatePNK(inputETH, totalETH, totalPNK, spread) {
  var ETH
  try {
    ETH = decimalStringToWeiBN(inputETH)
  } catch (_) {
    return '0'
  }
  // convert all to BN from BigNumber
  totalETH = toBN(totalETH)
  totalPNK = toBN(totalPNK)
  spread = toBN(spread)

  return ETH.mul(totalPNK)
    .mul(SPREAD_DIVISOR)
    .div(totalETH.add(ETH))
    .div(SPREAD_DIVISOR.add(spread))
    .toString()
}

/** Given an input PNK amount and the state values of the bonding curve contract,
 *  compute the amount of ETH that the PNK is sold for using the same formula as
 *  the bonding curve contract. Note this duplicates the algorithm from the contract
 *  but we can't call the contract because that way the turnaround would be too
 *  slow for a responsive UI.
 *  @param {string} inputPNK User input PNK amount. May not be a valid number.
 *  @param {BigNumber} totalETH 'totalETH' value of the contract.
 *  @param {BigNumber} totalPNK 'totalPNK' value of the contract.
 *  @param {BigNumber} spread 'spread' value of the contract.
 *  @returns {string} Amount of ETH in wei.
 */
export function estimateETH(inputPNK, totalETH, totalPNK, spread) {
  var PNK
  try {
    PNK = decimalStringToWeiBN(inputPNK)
  } catch (_) {
    return '0'
  }
  // convert all to BN from BigNumber
  totalETH = toBN(totalETH)
  totalPNK = toBN(totalPNK)
  spread = toBN(spread)

  return totalETH
    .mul(PNK)
    .mul(SPREAD_DIVISOR)
    .div(totalPNK.add(PNK))
    .div(SPREAD_DIVISOR.add(spread))
    .toString()
}

/**
 * Provides interaction with the bonding curve contract on the blockchain.
 */
export default class BondingCurve extends ContractImplementation {
  /**
   * Create new Bonding Curve Implementation.
   * @param {object} web3Provider - web3 instance.
   * @param {string} contractAddress - Address of the Bonding Curve contract.
   */
  constructor(web3Provider, contractAddress) {
    super(web3Provider, bondingCurveArtifact, contractAddress)
  }

  /**
   * Fetch the total amount of ETH in the bonding curve.
   * @returns {number} - The total amount of ETH as a BigNumber.
   */
  getTotalETH = async () => {
    await this.loadContract()
    try {
      return this.contractInstance.totalETH()
    } catch (err) {
      console.error(err)
      throw new Error('Unable to fetch totalETH from the bonding curve')
    }
  }

  /**
   * Fetch the total amount of bonded token in the bonding curve.
   * @returns {number} - The total amount of bonded token as a BigNumber.
   */
  getTotalTKN = async () => {
    await this.loadContract()
    try {
      return this.contractInstance.totalTKN()
    } catch (err) {
      console.error(err)
      throw new Error('Unable to fetch totalTKN from the bonding curve')
    }
  }

  /**
   * Fetch the spead of the bonding curve.
   * @returns {number} - The spread as a BigNumber.
   */
  getSpread = async () => {
    await this.loadContract()
    try {
      return this.contractInstance.spread()
    } catch (err) {
      console.error(err)
      throw new Error('Unable to fetch spread from the bonding curve')
    }
  }

  /**
   * Buy bonded token from the bonding curve.
   * @param {string} receiver - The account the brought token is accredited to.
   * @param {string} minTKN - The minimum amount of bonded token expected in return.
   * @param {string} amount - The amount of ETH to spend.
   * @param {string} account - The address of the buyer.
   * @returns {object} - The result transaction object.
   */
  buy = async (receiver, minTKN, amount, account) => {
    await this.loadContract()
    return this.contractInstance.buy(receiver, minTKN, {
      from: account,
      value: amount,
      gas: process.env.GAS || undefined
    })
  }

  /**
   * Sell bonded token to the bonding curve.
   * @param {string} amountTKN - The amount of token to sell.
   * @param {stirng} receiverAddr - The address to receive ETH.
   * @param {string} minETH - The minimum amount of ETH expected in return.
   * @param {string} account - The address of the seller.
   * @returns {object} - The result transaction object.
   */
  sell = async (amountTKN, receiverAddr, minETH, account) => {
    await this.loadContract()

    const pinakionContractAddress = await this.contractInstance.tokenContract()
    const pnkInstance = new MiniMePinakion(
      this.getWeb3Provider(),
      pinakionContractAddress
    )

    // See BondingCurve.sol in kleros-interaction for the definition of extraData.
    const extraData =
      '0x62637331' + // Magic number for string "bcs1"
      (receiverAddr.startsWith('0x') ? receiverAddr.slice(2) : receiverAddr) +
      new BN(minETH).toString(16, 64)

    await pnkInstance.loadContract()

    return pnkInstance.contractInstance.approveAndCall(
      this.contractAddress,
      amountTKN,
      extraData,
      { from: account }
    )
  }
}
