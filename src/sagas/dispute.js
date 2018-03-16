import { takeLatest, call, put, select } from 'redux-saga/effects'

import * as disputeActions from '../actions/dispute'
import * as walletSelectors from '../reducers/wallet'
import { kleros, ARBITRATOR_ADDRESS } from '../bootstrap/dapp-api'
import { action, errorAction } from '../utils/action'
import * as disputeConstants from '../constants/dispute'

// Parsers
const parseDispute = d => {
  // Find the latest appeal where the juror is drawn
  let latestAppealForJuror = null
  for (let i = d.appealJuror.length - 1; i >= 0; i--) {
    if (d.appealJuror[i].canRule) {
      latestAppealForJuror = i
      break
    }
  }

  // Build array of appeals, evidence submissions, and rulings as events
  let events = [
    ...d.appealJuror.slice(1).map((a, i) => ({
      ...a,
      type: disputeConstants.EVENT_TYPE_ENUM[0],
      date: new Date(d.appealCreatedAt[i])
    })),
    ...d.evidence.map(e => ({
      ...e,
      type: disputeConstants.EVENT_TYPE_ENUM[1],
      date: new Date(e.submittedAt)
    })),
    ...d.appealRulings.map(a => ({
      ...a,
      type: disputeConstants.EVENT_TYPE_ENUM[2],
      date: new Date(a.ruledAt)
    }))
  ]
  events = events.sort((a, b) => (a.data <= b.date ? -1 : 1))

  return {
    ...d,
    appealCreatedAt: d.appealCreatedAt.map(Date),
    appealDeadlines: d.appealDeadlines.map(Date),
    appealRuledAt: d.appealRuledAt.map(Date),
    latestAppealForJuror,
    events
  }
}

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
        disputes: disputes.map(parseDispute)
      })
    )
  } catch (err) {
    yield put(errorAction(disputeActions.disputes.FAIL_FETCH, err))
  }
}

/**
 * Fetches a dispute.
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
      action(disputeActions.dispute.RECEIVE, { dispute: parseDispute(dispute) })
    )
  } catch (err) {
    yield put(errorAction(disputeActions.dispute.FAIL_FETCH, err))
  }
}

/**
 * Votes on a dispute.
 */
function* voteOnDispute({ payload: { disputeID, votes, ruling } }) {
  try {
    yield put(action(disputeActions.dispute.UPDATE))

    const account = yield select(walletSelectors.getAccount)

    yield call(
      kleros.disputes.submitVotesForDispute,
      ARBITRATOR_ADDRESS,
      disputeID,
      ruling,
      votes,
      account
    )

    const dispute = yield call(
      kleros.disputes.getDataForDispute,
      ARBITRATOR_ADDRESS,
      disputeID,
      account
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
 * Repartitions the tokens at stake in a dispute.
 */
function* repartitionTokens({ payload: { disputeID } }) {
  try {
    yield put(action(disputeActions.dispute.UPDATE))

    const account = yield select(walletSelectors.getAccount)

    yield call(
      kleros.arbitrator.repartitionJurorTokens,
      ARBITRATOR_ADDRESS,
      disputeID,
      account
    )

    const dispute = yield call(
      kleros.disputes.getDataForDispute,
      ARBITRATOR_ADDRESS,
      disputeID,
      account
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
 * Executes a dispute's ruling.
 */
function* executeRuling({ payload: { disputeID } }) {
  try {
    yield put(action(disputeActions.dispute.UPDATE))

    const account = yield select(walletSelectors.getAccount)

    yield call(
      kleros.arbitrator.executeRuling,
      ARBITRATOR_ADDRESS,
      disputeID,
      account
    )

    const dispute = yield call(
      kleros.disputes.getDataForDispute,
      ARBITRATOR_ADDRESS,
      disputeID,
      account
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
  yield takeLatest(disputeActions.dispute.REPARTITION_TOKENS, repartitionTokens)
  yield takeLatest(disputeActions.dispute.EXECUTE_RULING, executeRuling)
}
