import { takeLatest, call, put, select } from 'redux-saga/effects'

import * as disputeActions from '../actions/dispute'
import * as walletSelectors from '../reducers/wallet'
import { kleros, ARBITRATOR_ADDRESS } from '../bootstrap/dapp-api'
import { action, errorAction } from '../utils/action'

/**
 * Fetches the current wallet's disputes.
 */
function* fetchDisputes() {
  try {
    const disputes = yield call(
      kleros.disputes.getDisputesForUser,
      ARBITRATOR_ADDRESS,
      yield select(walletSelectors.getAccount)
    )

    yield put(action(disputeActions.disputes.RECEIVE, { disputes }))
  } catch (err) {
    yield put(errorAction(disputeActions.disputes.FAIL_FETCH, err))
  }
}

/**
 * The root of the dispute saga.
 */
export default function* disputeSaga() {
  // Disputes
  yield takeLatest(disputeActions.disputes.FETCH, fetchDisputes)
}
