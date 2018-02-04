import { createActions } from '../utils/redux'

/* Actions */

// Disputes
export const disputes = createActions('DISPUTES')

/* Action Creators */

// Disputes
export const fetchDisputes = () => ({ type: disputes.FETCH })
