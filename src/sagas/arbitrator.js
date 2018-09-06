import { takeLatest, call, select } from 'redux-saga/effects'

import * as arbitratorActions from '../actions/arbitrator'
import * as walletSelectors from '../reducers/wallet'
import { kleros } from '../bootstrap/dapp-api'
import { lessduxSaga } from '../utils/saga'

/**
 * Fetches the PNK balance for the current wallet.
 * @returns {object} - The PNK balance.
 */
function* fetchPNKBalance() {
  return yield call(
    kleros.arbitrator.getPNKBalance,
    yield select(walletSelectors.getAccount)
  )
}

/**
 * Buys PNK for the current wallet.
 * @returns {object} - The update PNK balance.
 */
function* buyPNK({ payload: { amount } }) {
  return yield call(
    kleros.arbitrator.buyPNK,
    amount,
    yield select(walletSelectors.getAccount)
  )
}

/**
 * Buys PNK for the current wallet.
 * @returns {object} - The update PNK balance.
 */
function* transferPNK({ payload: { amount } }) {
  return yield call(
    kleros.arbitrator.transferPNKToArbitrator,
    amount,
    yield select(walletSelectors.getAccount)
  )
}
/**
 * Buys PNK for the current wallet.
 * @returns {object} - The update PNK balance.
 */
function* withdrawPNK({ payload: { amount } }) {
  return yield call(
    kleros.arbitrator.withdrawPNK,
    amount,
    yield select(walletSelectors.getAccount)
  )
}

/**
 * Activates PNK for the current wallet.
 * @returns {object} - The updated PNK balance.
 */
function* activatePNK({ payload: { amount } }) {
  return yield call(
    kleros.arbitrator.activatePNK,
    amount,
    yield select(walletSelectors.getAccount)
  )
}

/**
 * Fetches the arbitrator's data.
 * @returns {object} - The arbitrator data.
 */
export function* fetchArbitratorData() {
  return yield call(kleros.arbitrator.getData)
}

/**
 * Passes the arbitrator's period.
 * @returns {object} - The updated arbitrator data.
 */
function* passPeriod() {
  return yield call(
    kleros.arbitrator.passPeriod,
    yield select(walletSelectors.getAccount)
  )
}

/**
 * The root of the arbitrator saga.
 */
export default function* arbitratorSaga() {
  // PNK Balance
  yield takeLatest(
    arbitratorActions.PNKBalance.FETCH,
    lessduxSaga,
    'fetch',
    arbitratorActions.PNKBalance,
    fetchPNKBalance
  )
  yield takeLatest(
    arbitratorActions.PNKBalance.BUY,
    lessduxSaga,
    'update',
    arbitratorActions.PNKBalance,
    buyPNK
  )
  yield takeLatest(
    arbitratorActions.PNKBalance.ACTIVATE,
    lessduxSaga,
    'update',
    arbitratorActions.PNKBalance,
    activatePNK
  )
  yield takeLatest(
    arbitratorActions.PNKBalance.TRANSFER,
    lessduxSaga,
    'update',
    arbitratorActions.PNKBalance,
    transferPNK
  )
  yield takeLatest(
    arbitratorActions.PNKBalance.WITHDRAW,
    lessduxSaga,
    'update',
    arbitratorActions.PNKBalance,
    withdrawPNK
  )

  // Arbitrator Data
  yield takeLatest(
    arbitratorActions.arbitratorData.FETCH,
    lessduxSaga,
    'fetch',
    arbitratorActions.arbitratorData,
    fetchArbitratorData
  )
  yield takeLatest(
    arbitratorActions.arbitratorData.PASS_PERIOD,
    lessduxSaga,
    'update',
    arbitratorActions.arbitratorData,
    passPeriod
  )
}
