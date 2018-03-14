import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

import * as notificationActions from '../actions/notification'

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
        disputeId: PropTypes.number.isRequired,
        arbitratorAddress: PropTypes.string.isRequired
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
} = createResource(PropTypes.arrayOf(PropTypes.shape({})))
export { notificationsShape, pendingActionsShape }

// Reducer
export default createReducer(
  {
    notifications: notificationsInitialState,
    pendingActions: pendingActionsInitialState
  },
  {
    [notificationActions.notification.RECEIVE]: (state, action) => ({
      ...state,
      notifications: {
        ...state.notifications,
        data: [...state.notifications.data, action.payload.notification]
      }
    }),
    [notificationActions.notification.RECEIVE_UPDATED]: (state, action) => ({
      ...state,
      notifications: {
        ...state.notifications,
        data: action.payload.notifications
      }
    })
  }
)

// Selectors
export const getNotifications = state => state.notification.notifications
