import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

// Shapes
const {
  shape: notificationsShape,
  initialState: notificationsInitialState
} = createResource(
  PropTypes.arrayOf(
    PropTypes.shape({
      txHash: PropTypes.string.isRequired,
      notificationType: PropTypes.number.isRequired,
      logIndex: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired,
      data: PropTypes.shape({
        // TODO
        disputeId: PropTypes.number,
        arbitratorAddress: PropTypes.string
      }).isRequired,
      _id: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      read: PropTypes.bool.isRequired
    })
  )
)
const {
  shape: pendingActionsShape,
  initialState: pendingActionsInitialState
} = createResource(PropTypes.arrayOf(PropTypes.shape({}))) // TODO
export { notificationsShape, pendingActionsShape }

// Reducer
export default createReducer({
  notifications: notificationsInitialState,
  pendingActions: pendingActionsInitialState
})
