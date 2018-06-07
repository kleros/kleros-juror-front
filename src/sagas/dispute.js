import { takeLatest, all, call, put, select } from 'redux-saga/effects'

import { addContract } from '../chainstrap'
import * as disputeActions from '../actions/dispute'
import * as arbitratorActions from '../actions/arbitrator'
import * as walletSelectors from '../reducers/wallet'
import { kleros } from '../bootstrap/dapp-api'
import { lessduxSaga } from '../utils/saga'
import { action } from '../utils/action'
import * as disputeConstants from '../constants/dispute'
import * as chainViewConstants from '../constants/chain-view'

import { fetchArbitratorData } from './arbitrator'

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
    appealCreatedAt: d.appealJuror.map(
      appealJurorData => new Date(appealJurorData.createdAt)
    ),
    appealDeadlines: d.appealRulings.map(
      appealRulingData => new Date(appealRulingData.deadline)
    ),
    appealRuledAt: d.appealRulings.map(
      appealRulingData => new Date(appealRulingData.ruledAt)
    ),
    latestAppealForJuror,
    events
  }
}

/**
 * Fetches the current wallet's disputes.
 * @returns {object[]} - The disputes.
 */
function* fetchDisputes() {
  const [_disputes, arbitratorData] = yield all([
    call(
      kleros.arbitrator.getDisputesForUser,
      yield select(walletSelectors.getAccount)
    ),
    call(fetchArbitratorData)
  ])

  yield put(
    action(arbitratorActions.arbitratorData.RECEIVE, { arbitratorData })
  )

  const disputes = []
  for (const d of _disputes)
    if (d.arbitrableContractAddress && d.arbitrableContractAddress !== '0x') {
      yield call(
        kleros.arbitrable.setContractInstance,
        d.arbitrableContractAddress
      )

      const [arbitrableData, disputeDeadline] = yield all([
        call(kleros.arbitrable.getDataFromStore),
        call(
          kleros.disputes.getDisputeDeadline,
          d.disputeId,
          yield select(walletSelectors.getAccount),
          d.numberOfAppeals
        )
      ])

      disputes.push({
        ...d,
        description: arbitrableData ? arbitrableData.description : null,
        deadline: disputeDeadline ? new Date(disputeDeadline) : null
      })
    } else disputes.push(d)

  return disputes
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
  return yield call(fetchDispute, { payload: { disputeID } })
}

/**
 * Repartitions the tokens at stake in a dispute.
 * @returns {object} - The updated dispute.
 */
function* repartitionTokens({ payload: { disputeID } }) {
  const account = yield select(walletSelectors.getAccount)

  yield call(kleros.arbitrator.repartitionJurorTokens, disputeID, account)

  return yield call(fetchDispute, { payload: { disputeID } })
}

/**
 * Executes a dispute's ruling.
 * @returns {object} - The updated dispute.
 */
function* executeRuling({ payload: { disputeID } }) {
  const account = yield select(walletSelectors.getAccount)

  yield call(kleros.arbitrator.executeRuling, disputeID, account)

  return yield call(fetchDispute, { payload: { disputeID } })
}

/**
 * The root of the dispute saga.
 */
export default function* disputeSaga() {
  // Disputes
  yield takeLatest(
    disputeActions.disputes.FETCH,
    lessduxSaga,
    'fetch',
    disputeActions.disputes,
    fetchDisputes
  )

  // Dispute
  yield takeLatest(
    disputeActions.dispute.FETCH,
    lessduxSaga,
    'fetch',
    disputeActions.dispute,
    fetchDispute
  )
  yield takeLatest(
    disputeActions.dispute.VOTE_ON,
    lessduxSaga,
    'update',
    disputeActions.dispute,
    voteOnDispute
  )
  yield takeLatest(
    disputeActions.dispute.REPARTITION_TOKENS,
    lessduxSaga,
    'update',
    disputeActions.dispute,
    repartitionTokens
  )
  yield takeLatest(
    disputeActions.dispute.EXECUTE_RULING,
    lessduxSaga,
    'update',
    disputeActions.dispute,
    executeRuling
  )
}
