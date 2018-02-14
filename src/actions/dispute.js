import { createActions } from '../utils/redux'

/* Actions */

// Disputes
export const disputes = createActions('DISPUTES')
export const dispute = createActions('DISPUTE')

/* Action Creators */

// Disputes
export const fetchDisputes = () => ({ type: disputes.FETCH })
export const fetchDispute = disputeID => ({
  type: dispute.FETCH,
  payload: { disputeID }
})
