import ContractImplementation from 'kleros-api-2/lib/contracts/ContractImplementation'

import { takeLatest, call, select, all, put } from 'redux-saga/effects'

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
    if (!bondingCurve)
      bondingCurve = new BondingCurve(
        eth.currentProvider,
        BONDING_CURVE_ADDRESS
      )

    return bondingCurve
  }
})()

/**
 * Fetch reserve parameters of the bonding curve.
 * @returns {object} { totalETH, totalPNK } all keys map to big number objects.
 */
function* fetchBondingCurveTotals() {
  const [totalETH, totalPNK, allowance] = yield all([
    call(getBondingCurve().getTotalETH),
    call(getBondingCurve().getTotalTKN),
    call(
      getBondingCurve().getAllowance,
      yield select(walletSelectors.getAccount)
    )
  ])
  console.info(
    'totalETH',
    totalETH.toString(),
    'totalPNK',
    totalPNK.toString(),
    'allowance',
    allowance.toString()
  )

  return { totalETH, totalPNK, allowance }
}

/**
 * Buy PNK from the bonding curve.
 * @param {string} amount The amount of ETH the user has input.
 */
function* buyPNKFromBondingCurve({ payload: { amount } }) {
  yield put(bondingCurveActions.setUpdating(true))
  const addr = yield select(walletSelectors.getAccount)
  yield call(
    getBondingCurve().buy,
    addr,
    1,
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    amount,
    addr
  )
  yield put(bondingCurveActions.setUpdating(false))
}

/**
 * Sell PNK to the bonding curve.
 * @param {string} amount The amount of PNK the user has input.
 */
function* sellPNKToBondingCurve({ payload: { amount } }) {
  yield put(bondingCurveActions.setUpdating(true))
  const addr = yield select(walletSelectors.getAccount)
  yield call(
    getBondingCurve().sell,
    amount,
    addr,
    1,
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    addr
  )
  yield put(bondingCurveActions.setUpdating(false))
}

/**
 * Approve PNK to the bonding curve contract.
 */
function* approvePNKToBondingCurve({ payload: { amount } }) {
  yield put(bondingCurveActions.updateApproveTransactionProgress('pending'))

  const addr = yield select(walletSelectors.getAccount)
  const txID = yield call(getBondingCurve().approve, amount, addr)

  if (!txID) {
    yield put(bondingCurveActions.updateApproveTransactionProgress(''))
    return
  }

  yield put(bondingCurveActions.updateApproveTransactionProgress('confirming'))
  yield call(getBondingCurve().waitForApproval, addr)

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

    return new Promise((resolve, reject) => {
      const event = PNKInstance.Approval({
        owner,
        spender: this.contractAddress
      })
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
}
