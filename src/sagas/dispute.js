import { takeLatest, call, select } from 'redux-saga/effects'

import * as disputeActions from '../actions/dispute'
import * as walletSelectors from '../reducers/wallet'
import { kleros, ARBITRATOR_ADDRESS } from '../bootstrap/dapp-api'
import { fetchSaga, updateSaga } from '../utils/saga'
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
      date: a.ruledAt ? new Date(a.ruledAt) : null
    }))
  ]
  events = events.sort((a, b) => (a.data <= b.date || a.data !== null ? -1 : 1))

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
 * @returns {object[]} - The disputes.
 */
function* fetchDisputes() {
  return (yield call(
    kleros.disputes.getDisputesForUser,
    ARBITRATOR_ADDRESS,
    yield select(walletSelectors.getAccount)
  )).map(parseDispute)
}

/**
 * Fetches a dispute.
 * @returns {object} - The dispute.
 */
function* fetchDispute({ payload: { disputeID } }) {
  return parseDispute(
    yield call(
      kleros.disputes.getDataForDispute,
      ARBITRATOR_ADDRESS,
      disputeID,
      yield select(walletSelectors.getAccount)
    )
  )
}

/**
 * Votes on a dispute.
 * @returns {object} - The updated dispute.
 */
function* voteOnDispute({ payload: { disputeID, votes, ruling } }) {
  const account = yield select(walletSelectors.getAccount)

  yield call(
    kleros.disputes.submitVotesForDispute,
    ARBITRATOR_ADDRESS,
    disputeID,
    ruling,
    votes,
    account
  )

  return yield call(
    kleros.disputes.getDataForDispute,
    ARBITRATOR_ADDRESS,
    disputeID,
    account
  )
}

/**
 * Repartitions the tokens at stake in a dispute.
 * @returns {object} - The updated dispute.
 */
function* repartitionTokens({ payload: { disputeID } }) {
  const account = yield select(walletSelectors.getAccount)

  yield call(
    kleros.arbitrator.repartitionJurorTokens,
    ARBITRATOR_ADDRESS,
    disputeID,
    account
  )

  return yield call(
    kleros.disputes.getDataForDispute,
    ARBITRATOR_ADDRESS,
    disputeID,
    account
  )
}

/**
 * Executes a dispute's ruling.
 * @returns {object} - The updated dispute.
 */
function* executeRuling({ payload: { disputeID } }) {
  const account = yield select(walletSelectors.getAccount)

  yield call(
    kleros.arbitrator.executeRuling,
    ARBITRATOR_ADDRESS,
    disputeID,
    account
  )

  return yield call(
    kleros.disputes.getDataForDispute,
    ARBITRATOR_ADDRESS,
    disputeID,
    account
  )
}

/**
 * The root of the dispute saga.
 */
export default function* disputeSaga() {
  // Disputes
  yield takeLatest(
    disputeActions.disputes.FETCH,
    fetchSaga,
    disputeActions.disputes,
    fetchDisputes
  )

  // Dispute
  yield takeLatest(
    disputeActions.dispute.FETCH,
    fetchSaga,
    disputeActions.dispute,
    fetchDispute
  )
  yield takeLatest(
    disputeActions.dispute.VOTE_ON,
    updateSaga,
    disputeActions.dispute,
    voteOnDispute
  )
  yield takeLatest(
    disputeActions.dispute.REPARTITION_TOKENS,
    updateSaga,
    disputeActions.dispute,
    repartitionTokens
  )
  yield takeLatest(
    disputeActions.dispute.EXECUTE_RULING,
    updateSaga,
    disputeActions.dispute,
    executeRuling
  )
}
