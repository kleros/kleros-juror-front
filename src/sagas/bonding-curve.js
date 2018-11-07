import ContractImplementation from 'kleros-api/lib/contracts/ContractImplementation'

import { takeLatest, call, select, all } from 'redux-saga/effects'

import uniswapArtifact from '../assets/contracts/Uniswap'
import ERC20Artifact from '../assets/contracts/ERC20'
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
 * @returns {object} { totalETH, totalPNK } all keys map to big number objects.
 */
function* fetchBondingCurveTotals() {
  const [totalETH, totalPNK] = yield all([
    call(getBondingCurve().getTotalETH),
    call(getBondingCurve().getTotalTKN)
  ])
  console.info('totalETH', totalETH.toString(), 'totalPNK', totalPNK.toString())
  return { totalETH, totalPNK }
}

/**
 * Buy PNK from the bonding curve.
 * @param {string} amount The amount of ETH the user has input.
 * @returns {object} Updated reserve parameters of the bonding curve.
 */
function* buyPNKFromBondingCurve({ payload: { amount } }) {
  const addr = yield select(walletSelectors.getAccount)
  yield call(
    getBondingCurve().buy,
    addr,
    1,
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    amount,
    addr
  )
  return yield call(fetchBondingCurveTotals)
}

/**
 * Sell PNK to the bonding curve.
 * @param {string} amount The amount of PNK the user has input.
 * @returns {object} Updated reserve parameters of the bonding curve.
 */
function* sellPNKToBondingCurve({ payload: { amount } }) {
  const addr = yield select(walletSelectors.getAccount)
  yield call(
    getBondingCurve().sell,
    amount,
    addr,
    1,
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    addr
  )
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
    super(web3Provider, uniswapArtifact, contractAddress)
    const self = this
    this._PNKInstance = (async () => {
      await self.loadContract()
      const PNKContractAddress = await self.contractInstance.tokenAddress()
      return this._Web3Wrapper._web3.eth
        .contract(ERC20Artifact.abi)
        .at(PNKContractAddress)
    })()
  }

  /**
   * Fetch the total amount of ETH in the bonding curve.
   * @returns {number} - The total amount of ETH as a BigNumber.
   */
  getTotalETH = async () => {
    await this.loadContract()

    return new Promise((resolve, reject) =>
      // Note: the sync version doesn't work.
      this._Web3Wrapper._web3.eth.getBalance(
        this.contractAddress,
        (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        }
      )
    )
  }

  /**
   * Fetch the total amount of bonded token in the bonding curve.
   * @returns {number} - The total amount of bonded token as a BigNumber.
   */
  getTotalTKN = async () => {
    const PNKInstance = await this._PNKInstance
    return new Promise((resolve, reject) =>
      PNKInstance.balanceOf(this.contractAddress, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    )
  }

  /**
   * Buy bonded token from the bonding curve.
   * @param {string} receiver - The account the brought token is accredited to.
   * @param {string} minTKN - The minimum amount of bonded token expected in return.
   * @param {string} deadline - Transaction deadline timestamp in uint256.
   * @param {string} amount - The amount of ETH to spend.
   * @param {string} account - The address of the buyer.
   * @returns {object} - The result transaction object.
   */
  buy = async (receiver, minTKN, deadline, amount, account) => {
    await this.loadContract()
    try {
      return await this.contractInstance.ethToTokenTransferInput(
        minTKN,
        deadline,
        receiver,
        {
          from: account,
          value: amount
        }
      )
    } catch (err) {
      console.error('Error when buying PNK:', err)
    }
  }

  /**
   * Sell bonded token to the bonding curve.
   * @param {string} amountTKN - The amount of token to sell.
   * @param {stirng} receiverAddr - The address to receive ETH.
   * @param {string} minETH - The minimum amount of ETH expected in return.
   * @param {string} deadline - Transaction deadline timestamp in uint256.
   * @param {string} account - The address of the seller.
   */
  sell = async (amountTKN, receiverAddr, minETH, deadline, account) => {
    await this.loadContract()

    const PNKInstance = await this._PNKInstance

    try {
      await new Promise((resolve, reject) =>
        PNKInstance.approve(
          this.contractAddress,
          amountTKN,
          { from: account },
          (err, result) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          }
        )
      )
    } catch (err) {
      console.error('Error when approving:', err)
      return
    }

    try {
      await this.contractInstance.tokenToEthTransferInput(
        amountTKN,
        minETH,
        deadline,
        receiverAddr,
        { from: account }
      )
    } catch (err) {
      console.error('Error when selling PNK:', err)
    }
  }
}
