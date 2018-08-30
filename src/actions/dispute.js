import { createActions } from 'lessdux'

/* Actions */

// Disputes
export const disputes = {
  ...createActions('DISPUTES', { withUpdate: true }),
  FETCH_DEADLINES: 'FETCH_DISPUTE_DEADLINES'
}

// Dispute
export const dispute = {
  ...createActions('DISPUTE', { withUpdate: true }),
  VOTE_ON: 'VOTE_ON_DISPUTE',
  REPARTITION_TOKENS: 'REPARTITION_DISPUTE_TOKENS',
  EXECUTE_RULING: 'EXECUTE_DISPUTE_RULING'
}

/* Action Creators */

// Disputes
export const fetchDisputes = () => ({ type: disputes.FETCH })
export const fetchDisputeDeadlines = _disputes => ({
  type: disputes.FETCH_DEADLINES,
  payload: { _disputes }
})

// Dispute
export const fetchDispute = disputeID => ({
  type: dispute.FETCH,
  payload: { disputeID }
})
export const voteOnDispute = (disputeID, votes, ruling) => ({
  type: dispute.VOTE_ON,
  payload: { disputeID, votes, ruling }
})
export const repartitionTokens = disputeID => ({
  type: dispute.REPARTITION_TOKENS,
  payload: { disputeID }
})
export const executeRuling = disputeID => ({
  type: dispute.EXECUTE_RULING,
  payload: { disputeID }
})
