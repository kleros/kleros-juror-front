import ContractImplementation from 'kleros-api-2/lib/contracts/ContractImplementation'

import { takeLatest, call, select, all, put } from 'redux-saga/effects'

import uniswapArtifact from '../assets/contracts/Uniswap'
import ERC20Artifact from '../assets/contracts/ERC20'
import * as bondingCurveActions from '../actions/bonding-curve'
import * as arbitratorActions from '../actions/arbitrator'
import * as walletActions from '../actions/wallet'
import * as walletSelectors from '../reducers/wallet'
import { lessduxSaga } from '../utils/saga'

/**
 * Fetch reserve parameters of the bonding curve.
 * @returns {object} { totalETH, totalPNK } all keys map to big number objects.
 */
function* fetchBondingCurveTotals() {
  const [totalETH, totalPNK, allowance] = yield all([
    call(bondingCurve.getTotalETH),
    call(bondingCurve.getTotalTKN),
    call(bondingCurve.getAllowance, yield select(walletSelectors.getAccount))
  ])
  return { totalETH, totalPNK, allowance }
}

/**
 * Buy PNK from the bonding curve.
 * @param {string} amount The amount of ETH the user has input.
 */
function* buyPNKFromBondingCurve({ payload: { amount } }) {
  yield put(bondingCurveActions.setUpdating(true))
  const addr = yield select(walletSelectors.getAccount)
  const success = yield call(
    bondingCurve.buy,
    addr,
    1,
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    amount,
    addr
  )
  yield put(bondingCurveActions.setUpdating(false))

  if (!success) return
  yield call(bondingCurve.waitForBuy, addr)
  yield all([
    put(arbitratorActions.fetchPNKBalance()),
    put(bondingCurveActions.fetchBondingCurveData()),
    put(walletActions.fetchBalance())
  ])
}

/**
 * Sell PNK to the bonding curve.
 * @param {string} amount The amount of PNK the user has input.
 */
function* sellPNKToBondingCurve({ payload: { amount } }) {
  yield put(bondingCurveActions.setUpdating(true))
  const addr = yield select(walletSelectors.getAccount)
  const success = yield call(
    bondingCurve.sell,
    amount,
    addr,
    1,
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    addr
  )
  yield put(bondingCurveActions.setUpdating(false))
  if (!success) return
  yield call(bondingCurve.waitForSell, addr)
  yield all([
    put(arbitratorActions.fetchPNKBalance()),
    put(bondingCurveActions.fetchBondingCurveData()),
    put(walletActions.fetchBalance())
  ])
}

/**
 * Approve PNK to the bonding curve contract.
 */
function* approvePNKToBondingCurve({ payload: { amount } }) {
  yield put(bondingCurveActions.updateApproveTransactionProgress('pending'))

  const addr = yield select(walletSelectors.getAccount)
  const txID = yield call(bondingCurve.approve, amount, addr)

  if (!txID) {
    yield put(bondingCurveActions.updateApproveTransactionProgress(''))
    return
  }

  yield put(bondingCurveActions.updateApproveTransactionProgress('confirming'))
  yield call(bondingCurve.waitForApproval, addr)

  yield put(bondingCurveActions.updateApproveTransactionProgress('done'))
  yield call(fetchBondingCurveTotals)
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
    buyPNKFromBondingCurve
  )
  yield takeLatest(
    bondingCurveActions.bondingCurve.SELL_PNK,
    sellPNKToBondingCurve
  )
  yield takeLatest(
    bondingCurveActions.bondingCurve.APPROVE_PNK,
    approvePNKToBondingCurve
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
          if (err) reject(err)
          else resolve(result)
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
        if (err) reject(err)
        else resolve(result)
      })
    )
  }

  /**
   * Fetch the amount of PNK approved to the bonding curve contract.
   * @param {string} account - The user account.
   * @returns {number} - BigNumber.
   */
  getAllowance = async account => {
    const PNKInstance = await this._PNKInstance

    return new Promise((resolve, reject) =>
      PNKInstance.allowance(account, this.contractAddress, (err, result) => {
        if (err) reject(err)
        else resolve(result)
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
   * @returns {bool} Successfulness.
   */
  buy = async (receiver, minTKN, deadline, amount, account) => {
    await this.loadContract()
    try {
      await this.contractInstance.ethToTokenTransferInput(
        minTKN,
        deadline,
        receiver,
        {
          from: account,
          value: amount
        }
      )
      return true
    } catch (err) {
      console.error('Error when buying PNK:', err)
      return false
    }
  }

  /**
   * Sell bonded token to the bonding curve.
   * @param {string} amountTKN - The amount of token to sell.
   * @param {stirng} receiverAddr - The address to receive ETH.
   * @param {string} minETH - The minimum amount of ETH expected in return.
   * @param {string} deadline - Transaction deadline timestamp in uint256.
   * @param {string} account - The address of the seller.
   * @returns {bool} Successfulness.
   */
  sell = async (amountTKN, receiverAddr, minETH, deadline, account) => {
    await this.loadContract()

    try {
      await this.contractInstance.tokenToEthTransferInput(
        amountTKN,
        minETH,
        deadline,
        receiverAddr,
        { from: account }
      )
      return true
    } catch (err) {
      console.error('Error when selling PNK:', err)
      return false
    }
  }

  /**
   * Approve tokens to the bonding curve contract.
   * @param {string} amount - The amount of token to be approve.
   * @param {string} account - The token owner account.
   * @returns {string} - The transaction ID, or null if it fails.
   */
  approve = async (amount, account) => {
    const PNKInstance = await this._PNKInstance

    try {
      return await new Promise((resolve, reject) =>
        PNKInstance.approve(
          this.contractAddress,
          amount,
          { from: account },
          (err, result) => {
            if (err) reject(err)
            else resolve(result)
          }
        )
      )
    } catch (err) {
      console.error('Error when approving:', err)
      return null
    }
  }

  /**
   * Wait for the approve() transaction to be mined.
   * @param {string} owner - Token owner's address.
   * @returns {Promise} - A promise to wait for.
   */
  waitForApproval = async owner => {
    const PNKInstance = await this._PNKInstance

    return waitForEvent(
      PNKInstance.Approval({
        owner,
        spender: this.contractAddress
      })
    )
  }

  /**
   * Wait for the selling transaction to be mined.
   * @param {string} addr - The address of the seller.
   * @returns {Promise} - A promise to wait for.
   */
  waitForSell = async addr => {
    await this.loadContract()

    return waitForEvent(this.contractInstance.EthPurchase({ buyer: addr }))
  }

  /**
   * Wait for the buying transaction to be mined.
   * @param {string} addr - The address of the buyer.
   * @returns {Promise} - A promise to wait for.
   */
  waitForBuy = async addr => {
    await this.loadContract()

    return waitForEvent(this.contractInstance.TokenPurchase({ buyer: addr }))
  }
}

let bondingCurve

/**
 * Initialized the bonding curve.
 * @param {object} web3Provider - The web3 provider.
 * @param {string} contractAddress - The contract address.
 */
export function initializeBondingCurve(web3Provider, contractAddress) {
  bondingCurve = new BondingCurve(web3Provider, contractAddress)
}

/**
 * Wait for an event.
 * @param {object} event - The event object.
 * @returns {Promise} - A promise to wait for.
 */
function waitForEvent(event) {
  return new Promise((resolve, reject) => {
    event.watch((err, _log) => {
      try {
        // The should be called according to the doc but it throws.
        event.stopWatching()
      } catch (_) {}
      if (err) reject(err)
      else resolve()
    })
  })
}
