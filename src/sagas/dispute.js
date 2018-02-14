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

    yield put(
      action(disputeActions.disputes.RECEIVE, {
        disputes: disputes.map(d => ({ ...d, deadline: new Date(d.deadline) }))
      })
    )
  } catch (err) {
    yield put(errorAction(disputeActions.disputes.FAIL_FETCH, err))
  }
}

/**
 * Fetches a dispute by dispute ID.
 */
function* fetchDispute({ payload: { disputeID } }) {
  try {
    const dispute = yield call(
      kleros.disputes.getDataForDispute,
      ARBITRATOR_ADDRESS,
      disputeID,
      yield select(walletSelectors.getAccount)
    )

    yield put(
      action(disputeActions.dispute.RECEIVE, {
        dispute: { ...dispute, deadline: new Date(dispute.deadline) }
      })
    )
  } catch (err) {
    yield put(errorAction(disputeActions.dispute.FAIL_FETCH, err))
  }
}

/**
 * Votes on a dispute by dispute ID.
 */
function* voteOnDispute({ payload: { disputeID, votes, ruling } }) {
  try {
    yield put(action(disputeActions.dispute.UPDATE))

    yield call(
      kleros.disputes.submitVotesForDispute,
      ARBITRATOR_ADDRESS,
      disputeID,
      ruling,
      votes,
      yield select(walletSelectors.getAccount)
    )

    const dispute = yield call(
      kleros.disputes.getDataForDispute,
      ARBITRATOR_ADDRESS,
      disputeID,
      yield select(walletSelectors.getAccount)
    )

    yield put(
      action(disputeActions.dispute.RECEIVE_UPDATED, {
        dispute
      })
    )
  } catch (err) {
    yield put(errorAction(disputeActions.dispute.FAIL_UPDATE, err))
  }
}

/**
 * The root of the dispute saga.
 */
export default function* disputeSaga() {
  // Disputes
  yield takeLatest(disputeActions.disputes.FETCH, fetchDisputes)

  // Dispute
  yield takeLatest(disputeActions.dispute.FETCH, fetchDispute)
  yield takeLatest(disputeActions.dispute.VOTE_ON, voteOnDispute)
}
