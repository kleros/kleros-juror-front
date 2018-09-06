import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

// Common Shapes
export const _notificationShape = PropTypes.shape({
  txHash: PropTypes.string.isRequired,
  notificationType: PropTypes.number.isRequired,
  logIndex: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  data: PropTypes.shape({
    // TODO
    disputeID: PropTypes.number,
    arbitratorAddress: PropTypes.string
  }).isRequired,
  _id: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  read: PropTypes.bool.isRequired
})
export const _notificationsShape = PropTypes.arrayOf(
  _notificationShape.isRequired
)

// Shapes
const {
  shape: notificationsShape,
  initialState: notificationsInitialState
} = createResource(_notificationsShape)
const {
  shape: notificationShape,
  initialState: notificationInitialState
} = createResource(_notificationShape)
const {
  shape: pendingActionsShape,
  initialState: pendingActionsInitialState
} = createResource(PropTypes.arrayOf(PropTypes.shape({}))) // TODO
export { notificationsShape, notificationShape, pendingActionsShape }

// Reducer
export default createReducer({
  notifications: notificationsInitialState,
  notification: notificationInitialState,
  pendingActions: pendingActionsInitialState
})
