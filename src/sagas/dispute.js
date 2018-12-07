import { takeLatest, all, call, put, select } from 'redux-saga/effects'

import * as disputeActions from '../actions/dispute'
import * as arbitratorActions from '../actions/arbitrator'
import * as walletSelectors from '../reducers/wallet'
import { kleros, archon, ARBITRATOR_ADDRESS } from '../bootstrap/dapp-api'
import { lessduxSaga } from '../utils/saga'
import { action } from '../utils/action'
import * as disputeConstants from '../constants/dispute'

import { fetchArbitratorData } from './arbitrator'

const parseDispute = d => {
  // Find the latest appeal where the juror is drawn
  let latestAppealForJuror = null
  for (let i = d.appealJuror.length - 1; i >= 0; i--)
    if (d.appealJuror[i].canRule) {
      latestAppealForJuror = i
      break
    }

  // Convert evidence timestamps to dates
  d.evidence = d.evidence.map(e => {
    e.submittedAt = new Date(e.submittedAt * 1000)
    return e
  })

  // Build array of appeals, evidence submissions, and rulings as events
  let events = [
    ...d.appealJuror.slice(1).map((a, i) => ({
      ...a,
      type: disputeConstants.EVENT_TYPE_ENUM[0],
      // Appeal `createdAt` is null in the appeal period of the session it was raised in, use the current date in that case
      date: a.createdAt ? new Date(a.createdAt) : new Date(),
      appealNumber: i + 1
    })),
    ...d.evidence.map(e => ({
      ...e,
      type: disputeConstants.EVENT_TYPE_ENUM[1],
      date: new Date(e.submittedAt)
    })),
    ...d.appealRulings.map((a, i) => ({
      ...a,
      type: disputeConstants.EVENT_TYPE_ENUM[2],
      date: a.ruledAt ? new Date(a.ruledAt) : null,
      appealNumber: i
    }))
  ]
  events = events.sort((a, b) => {
    // Put events with no date at the end, these are in progress
    const dateAisNull = a.date === null
    const dateBisNull = b.date === null
    if (dateAisNull && dateBisNull) return 0
    if (dateAisNull) return 1
    if (dateBisNull) return -1
    return a.date - b.date
  })

  return {
    ...d,
    appealCreatedAt: d.appealJuror.map(appealJurorData =>
      appealJurorData.createdAt ? new Date(appealJurorData.createdAt) : null
    ),
    appealDeadlines: d.appealRulings.map(appealRulingData =>
      appealRulingData.deadline ? new Date(appealRulingData.deadline) : null
    ),
    appealRuledAt: d.appealRulings.map(appealRulingData =>
      appealRulingData.ruledAt ? new Date(appealRulingData.ruledAt) : null
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
  const account = yield select(walletSelectors.getAccount)

  const [_disputes, arbitratorData] = yield all([
    call(kleros.arbitrator.getDisputesForUser, account),
    call(fetchArbitratorData)
  ])

  yield put(
    action(arbitratorActions.arbitratorData.RECEIVE, { arbitratorData })
  )
  const disputes = []
  for (const d of _disputes)
    if (d.arbitrableContractAddress && d.arbitrableContractAddress !== '0x')
      // legacy disputes, or disputes that do not follow the standard may not have MetaEvidence
      try {
        const disputeData = yield call(
          archon.arbitrable.getDispute,
          d.arbitrableContractAddress,
          ARBITRATOR_ADDRESS,
          d.disputeID
        )
        const metaEvidence = yield call(
          archon.arbitrable.getMetaEvidence,
          d.arbitrableContractAddress,
          disputeData.metaEvidenceID
        )
        // TODO handle invalid hashes

        disputes.push({
          ...d,
          title: metaEvidence.metaEvidenceJSON.title || null,
          description: metaEvidence.metaEvidenceJSON.description || null
        })
      } catch (err) {
        console.error(err)
        disputes.push(d)
      }
    else disputes.push(d)

  return disputes
}

/**
 * Updates dispute set with deadlines
 * @returns {object[]} - The disputes.
 */
function* fetchDisputeDeadlines({ payload: { _disputes } }) {
  const disputeDeadlines = yield all(
    _disputes.map(dispute =>
      call(
        kleros.disputes.getDisputeDeadline,
        dispute.disputeID,
        dispute.numberOfAppeals
      )
    )
  )

  const disputes = []
  for (let i = 0; i < _disputes.length; i++)
    disputes.push({
      ..._disputes[i],
      deadline: disputeDeadlines[i] ? new Date(disputeDeadlines[i]) : null
    })

  return disputes
}

/**
 * Fetches a dispute.
 * @returns {object} - The dispute.
 */
function* fetchDispute({ payload: { disputeID } }) {
  // Fetch extra data from contracts
  const account = yield select(walletSelectors.getAccount)

  const [disputeData, session, period, jurorStoreData, netPNK] = yield all([
    call(kleros.arbitrator.getDispute, disputeID, true),
    call(kleros.arbitrator.getSession),
    call(kleros.arbitrator.getPeriod),
    call(kleros.disputes.getDisputeFromStore, account, disputeID),
    call(kleros.arbitrator.getNetTokensForDispute, disputeID, account)
  ])

  const disputeLogData = yield call(
    archon.arbitrable.getDispute,
    disputeData.arbitrableContractAddress,
    ARBITRATOR_ADDRESS,
    disputeID
  )

  // Fetch Evidence and MetaEvidence
  const [metaEvidence, evidence] = yield all([
    call(
      archon.arbitrable.getMetaEvidence,
      disputeData.arbitrableContractAddress,
      disputeLogData.metaEvidenceID
    ),
    call(
      archon.arbitrable.getEvidence,
      disputeData.arbitrableContractAddress,
      ARBITRATOR_ADDRESS,
      disputeID
    )
  ])

  // fetch extra data needed for juror and ruling
  const appealJuror = []
  const appealRulings = []
  for (let appeal = 0; appeal <= disputeData.numberOfAppeals; appeal++) {
    // start fetching timestamps ASAP because they take the most time
    const timestampPromises = [
      call(kleros.disputes.getAppealCreatedAt, disputeID, account, appeal),
      call(kleros.disputes.getDisputeDeadline, disputeID, appeal),
      call(kleros.disputes.getAppealRuledAt, disputeID, appeal)
    ]

    const lastAppealSession = disputeData.firstSession + appeal
    const isLastAppeal = lastAppealSession === session
    // Get appeal data
    const draws = jurorStoreData.appealDraws
      ? jurorStoreData.appealDraws[appeal] || []
      : []
    let canRule = false
    let canRepartition = false
    let canExecute = false
    let ruling = null

    const rulingPromises = [
      call(kleros.arbitrator.currentRulingForDispute, disputeID, appeal)
    ]

    // Extra info for the last appeal
    if (isLastAppeal) {
      if (draws.length > 0)
        rulingPromises.push(
          call(kleros.arbitrator.canRuleDispute, disputeID, draws, account)
        )

      if (session && period)
        canRepartition =
          lastAppealSession <= session && // Not appealed to the next session
          period === 4 && // Executable period
          disputeData.state === 0 // Open dispute
      canExecute = disputeData.state === 2 // Executable state
    }

    // Wait for parallel requests to complete
    ;[ruling, canRule] = yield all(rulingPromises) // es-lint-ignore prefer-const

    let jurorRuling = null // es-lint-ignore prefer-const
    // if can't rule that means they already did or they missed it
    if (draws.length > 0 && !canRule)
      jurorRuling = yield call(
        kleros.arbitrator.getVoteForJuror,
        disputeID,
        appeal,
        account
      )

    // wait for all timestamps to be fetched
    const [appealCreatedAt, appealDeadline, appealRuledAt] = yield all(
      timestampPromises
    )

    appealJuror[appeal] = {
      createdAt: appealCreatedAt,
      fee: disputeData.arbitrationFeePerJuror.mul(draws.length),
      draws,
      jurorRuling,
      canRule
    }
    appealRulings[appeal] = {
      voteCounter: disputeData.voteCounters[appeal],
      deadline: appealDeadline,
      ruledAt: appealRuledAt,
      ruling,
      canRepartition,
      canExecute
    }
  }

  const dispute = {
    ...disputeData,
    ...metaEvidence,
    evidence,
    appealJuror,
    appealRulings,
    netPNK
  }

  return yield call(parseDispute, dispute)
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
  yield takeLatest(
    disputeActions.disputes.FETCH_DEADLINES,
    lessduxSaga,
    'update',
    disputeActions.disputes,
    fetchDisputeDeadlines
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
