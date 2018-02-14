import { createActions } from '../utils/redux'

/* Actions */

// Disputes
export const disputes = createActions('DISPUTES')

// Dispute
export const dispute = {
  ...createActions('DISPUTE', { withUpdate: true }),
  VOTE_ON: 'VOTE_ON_DISPUTE'
}

/* Action Creators */

// Disputes
export const fetchDisputes = () => ({ type: disputes.FETCH })

// Dispute
export const fetchDispute = disputeID => ({
  type: dispute.FETCH,
  payload: { disputeID }
})
export const voteOnDispute = (disputeID, votes, ruling) => ({
  type: dispute.VOTE_ON,
  payload: { disputeID, votes, ruling }
})
