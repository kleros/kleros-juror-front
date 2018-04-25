import { takeLatest, call, select } from 'redux-saga/effects'

import * as arbitratorActions from '../actions/arbitrator'
import * as walletSelectors from '../reducers/wallet'
import { kleros } from '../bootstrap/dapp-api'
import { fetchSaga, updateSaga } from '../utils/saga'

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
    fetchSaga,
    arbitratorActions.PNKBalance,
    fetchPNKBalance
  )
  yield takeLatest(
    arbitratorActions.PNKBalance.BUY,
    updateSaga,
    arbitratorActions.PNKBalance,
    buyPNK
  )
  yield takeLatest(
    arbitratorActions.PNKBalance.ACTIVATE,
    updateSaga,
    arbitratorActions.PNKBalance,
    activatePNK
  )

  // Arbitrator Data
  yield takeLatest(
    arbitratorActions.arbitratorData.FETCH,
    fetchSaga,
    arbitratorActions.arbitratorData,
    fetchArbitratorData
  )
  yield takeLatest(
    arbitratorActions.arbitratorData.PASS_PERIOD,
    updateSaga,
    arbitratorActions.arbitratorData,
    passPeriod
  )
}
