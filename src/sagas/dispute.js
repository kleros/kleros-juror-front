import { takeLatest, all, call, put, select } from 'redux-saga/effects'

import { addContract } from '../chainstrap'
import * as disputeActions from '../actions/dispute'
import * as arbitratorActions from '../actions/arbitrator'
import * as walletSelectors from '../reducers/wallet'
import { kleros } from '../bootstrap/dapp-api'
import { fetchSaga, updateSaga } from '../utils/saga'
import { action } from '../utils/action'
import * as disputeConstants from '../constants/dispute'
import * as chainViewConstants from '../constants/chain-view'

import { fetchArbitratorData } from './arbitrator'

// Parsers
const parseDisputes = (disputes, deadline, currentSession) =>
  disputes.map(d => ({
    ...d,
    deadline:
      d.firstSession + d.numberOfAppeals === currentSession
        ? new Date(deadline)
        : null
  }))

const parseDispute = d => {
  // Add arbitrable contract to ChainView
  addContract({
    name: chainViewConstants.ARBITRABLE_CONTRACT_NAME,
    address: d.arbitrableContractAddress,
    color: chainViewConstants.ARBITRABLE_CONTRACT_COLOR
  })

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
  const [_disputes, deadline, arbitratorData] = yield all([
    call(
      kleros.arbitrator.getDisputesForUser,
      yield select(walletSelectors.getAccount)
    ),
    call(kleros.arbitrator.getDeadlineForOpenDispute),
    call(fetchArbitratorData)
  ])

  yield put(
    action(arbitratorActions.arbitratorData.RECEIVE, { arbitratorData })
  )

  const disputes = []
  for (const d of _disputes) {
    if (d.arbitrableContractAddress && d.arbitrableContractAddress !== '0x') {
      yield call(
        kleros.arbitrable.setContractInstance,
        d.arbitrableContractAddress
      )
      disputes.push({
        ...d,
        description: (yield call(kleros.arbitrable.getDataFromStore))
          .description
      })
    } else disputes.push(d)
  }

  return parseDisputes(disputes, deadline, arbitratorData.session)
}

/**
 * Fetches a dispute.
 * @returns {object} - The dispute.
 */
function* fetchDispute({ payload: { disputeID } }) {
  return parseDispute(
    yield call(
      kleros.disputes.getDataForDispute,
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

  yield call(kleros.arbitrator.submitVotes, disputeID, ruling, votes, account)

  return yield call(kleros.disputes.getDataForDispute, disputeID, account)
}

/**
 * Repartitions the tokens at stake in a dispute.
 * @returns {object} - The updated dispute.
 */
function* repartitionTokens({ payload: { disputeID } }) {
  const account = yield select(walletSelectors.getAccount)

  yield call(kleros.arbitrator.repartitionJurorTokens, disputeID, account)

  return yield call(kleros.disputes.getDataForDispute, disputeID, account)
}

/**
 * Executes a dispute's ruling.
 * @returns {object} - The updated dispute.
 */
function* executeRuling({ payload: { disputeID } }) {
  const account = yield select(walletSelectors.getAccount)

  yield call(kleros.arbitrator.executeRuling, disputeID, account)

  return yield call(kleros.disputes.getDataForDispute, disputeID, account)
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
