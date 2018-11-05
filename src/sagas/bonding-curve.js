import { BN } from 'ethjs'
import ContractImplementation from 'kleros-api/lib/contracts/ContractImplementation'
import MiniMePinakion from 'kleros-api/lib/contracts/implementations/PNK/MiniMePinakion'

import { takeLatest, call, select, all } from 'redux-saga/effects'

import bondingCurveArtifact from '../assets/contracts/BondingCurve'
import { eth, BONDING_CURVE_ADDRESS } from '../bootstrap/dapp-api'
import * as bondingCurveActions from '../actions/bonding-curve'
import * as walletSelectors from '../reducers/wallet'
import { lessduxSaga } from '../utils/saga'

/**
 * The factory method for accessing the bonding curve contract. This method is
 * necessary because the contract address is not available until the <Initializer>
 * mounts, so we can't bind a module level variable to a BondingCurve instance.
 * @returns {BondingCurve} The BondingCurve instance.
 */
const getBondingCurve = (function() {
  var bondingCurve
  return function() {
    if (!bondingCurve) {
      bondingCurve = new BondingCurve(
        eth.currentProvider,
        BONDING_CURVE_ADDRESS
      )
    }
    return bondingCurve
  }
})()

/**
 * Fetch reserve parameters of the bonding curve.
 * @returns {object} { totalETH, totalPNK, spread } all keys map to big number objects.
 */
function* fetchBondingCurveTotals() {
  const [totalETH, totalPNK, spread] = yield all([
    call(getBondingCurve().getTotalETH),
    call(getBondingCurve().getTotalTKN),
    call(getBondingCurve().getSpread)
  ])
  return { totalETH, totalPNK, spread }
}

/**
 * Buy PNK from the bonding curve.
 * @param {string} amount The amount of ETH the user has input.
 * @returns {object} Updated reserve parameters of the bonding curve.
 */
function* buyPNKFromBondingCurve({ payload: { amount } }) {
  const addr = yield select(walletSelectors.getAccount)
  yield call(getBondingCurve().buy, addr, 0, amount, addr)
  return yield call(fetchBondingCurveTotals)
}

/**
 * Sell PNK to the bonding curve.
 * @param {string} amount The amount of PNK the user has input.
 * @returns {object} Updated reserve parameters of the bonding curve.
 */
function* sellPNKToBondingCurve({ payload: { amount } }) {
  const addr = yield select(walletSelectors.getAccount)
  yield call(getBondingCurve().sell, amount, addr, 0, addr)
  return yield call(fetchBondingCurveTotals)
}

/**
 * The root of the bonding curve saga.
 */
export default function* bondingCurveSaga() {
  yield takeLatest(
    bondingCurveActions.bondingCurve.FETCH,
    lessduxSaga,
    'fetch',
    bondingCurveActions.bondingCurve,
    fetchBondingCurveTotals
  )
  yield takeLatest(
    bondingCurveActions.bondingCurve.BUY_PNK,
    lessduxSaga,
    'update',
    bondingCurveActions.bondingCurve,
    buyPNKFromBondingCurve
  )
  yield takeLatest(
    bondingCurveActions.bondingCurve.SELL_PNK,
    lessduxSaga,
    'update',
    bondingCurveActions.bondingCurve,
    sellPNKToBondingCurve
  )
}

/**
 * Provides interaction with the bonding curve contract on the blockchain.
 */
class BondingCurve extends ContractImplementation {
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
