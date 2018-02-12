import { takeLatest, call, put, select } from 'redux-saga/effects'

import * as arbitratorActions from '../actions/arbitrator'
import * as walletSelectors from '../reducers/wallet'
import { kleros, ARBITRATOR_ADDRESS } from '../bootstrap/dapp-api'
import { action, errorAction } from '../utils/action'

/**
 * Fetches the PNK balance for the current wallet.
 */
function* fetchPNKBalance() {
  try {
    const { tokenBalance, activatedTokens, lockedTokens } = yield call(
      kleros.arbitrator.getPNKBalance,
      ARBITRATOR_ADDRESS,
      yield select(walletSelectors.getAccount)
    )

    yield put(
      action(arbitratorActions.PNKBalance.RECEIVE, {
        PNKBalance: {
          tokenBalance: Number(tokenBalance), // TODO: Fix on API side
          activatedTokens,
          lockedTokens: Number(lockedTokens) // TODO: Fix on API side
        }
      })
    )
  } catch (err) {
    yield put(errorAction(arbitratorActions.PNKBalance.FAIL_FETCH, err))
  }
}

/**
 * Buys PNK for the current wallet.
 */
function* buyPNK({ payload: { amount } }) {
  try {
    yield put(action(arbitratorActions.PNKBalance.UPDATE))

    const { tokenBalance, activatedTokens, lockedTokens } = yield call(
      kleros.arbitrator.buyPNK,
      amount,
      ARBITRATOR_ADDRESS,
      yield select(walletSelectors.getAccount)
    )

    yield put(
      action(arbitratorActions.PNKBalance.RECEIVE_UPDATED, {
        PNKBalance: {
          tokenBalance: Number(tokenBalance), // TODO: Fix on API side
          activatedTokens,
          lockedTokens: Number(lockedTokens) // TODO: Fix on API side
        }
      })
    )
  } catch (err) {
    yield put(errorAction(arbitratorActions.PNKBalance.FAIL_UPDATE, err))
  }
}

/**
 * Activates PNK for the current wallet.
 */
function* activatePNK({ payload: { amount } }) {
  try {
    yield put(action(arbitratorActions.PNKBalance.UPDATE))

    const { tokenBalance, activatedTokens, lockedTokens } = yield call(
      kleros.arbitrator.activatePNK,
      amount,
      ARBITRATOR_ADDRESS,
      yield select(walletSelectors.getAccount)
    )

    yield put(
      action(arbitratorActions.PNKBalance.RECEIVE_UPDATED, {
        PNKBalance: {
          tokenBalance: Number(tokenBalance), // TODO: Fix on API side
          activatedTokens,
          lockedTokens: Number(lockedTokens) // TODO: Fix on API side
        }
      })
    )
  } catch (err) {
    yield put(errorAction(arbitratorActions.PNKBalance.FAIL_UPDATE, err))
  }
}

/**
 * Fetches the arbitrator's data.
 */
function* fetchArbitratorData() {
  try {
    const arbitratorData = yield call(
      kleros.arbitrator.getData,
      ARBITRATOR_ADDRESS
    )

    yield put(
      action(arbitratorActions.arbitratorData.RECEIVE, { arbitratorData })
    )
  } catch (err) {
    yield put(errorAction(arbitratorActions.arbitratorData.FAIL_FETCH, err))
  }
}

/**
 * Passes the arbitrator's period.
 */
function* passPeriod() {
  try {
    yield put(action(arbitratorActions.arbitratorData.UPDATE))

    const arbitratorData = yield call(
      kleros.arbitrator.passPeriod,
      ARBITRATOR_ADDRESS,
      yield select(walletSelectors.getAccount)
    )

    yield put(
      action(arbitratorActions.arbitratorData.RECEIVE_UPDATED, {
        arbitratorData
      })
    )
  } catch (err) {
    yield put(errorAction(arbitratorActions.arbitratorData.FAIL_UPDATE, err))
  }
}

/**
 * The root of the arbitrator saga.
 */
export default function* arbitratorSaga() {
  // PNK Balance
  yield takeLatest(arbitratorActions.PNKBalance.FETCH, fetchPNKBalance)
  yield takeLatest(arbitratorActions.PNKBalance.BUY, buyPNK)
  yield takeLatest(arbitratorActions.PNKBalance.ACTIVATE, activatePNK)

  // Arbitrator Data
  yield takeLatest(arbitratorActions.arbitratorData.FETCH, fetchArbitratorData)
  yield takeLatest(arbitratorActions.arbitratorData.PASS_PERIOD, passPeriod)
}
