import { takeLatest, call, put, select } from 'redux-saga/effects'

import * as walletSelectors from '../reducers/wallet'
import * as disputeActions from '../actions/dispute'
import { kleros, ARBITRATOR_ADDRESS } from '../bootstrap/dapp-api'
import { receiveAction, errorAction } from '../utils/action'

/**
 * Fetches the current wallet's disputes.
 */
export function* fetchDisputes() {
  try {
    const disputes = yield call(
      kleros.disputes.getDisputesForUser,
      ARBITRATOR_ADDRESS,
      yield select(walletSelectors.getAccount)
    )

    yield put(receiveAction(disputeActions.RECEIVE_DISPUTES, { disputes }))
  } catch (err) {
    yield put(errorAction(disputeActions.FAIL_FETCH_DISPUTES, err))
  }
}

/**
 * The root of the dispute saga.
 * @export default disputeSaga
 */
export default function* disputeSaga() {
  yield takeLatest(disputeActions.FETCH_DISPUTES, fetchDisputes)
}
