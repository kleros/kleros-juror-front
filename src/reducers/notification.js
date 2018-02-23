import PropTypes from 'prop-types'

import * as notificationActions from '../actions/notification'
import createReducer, { createResource } from '../utils/redux'

// Shapes
const {
  shape: notificationsShape,
  initialState: notificationsInitialState
} = createResource(PropTypes.arrayOf(PropTypes.string))
export { notificationsShape }

// Reducer
export default createReducer(
  {
    notifications: notificationsInitialState
  },
  {
    [notificationActions.notification.RECEIVE]: (state, action) => ({
      ...state,
      notifications: {
        ...state.notifications,
        data: [...state.notifications.data, action.payload.notification]
      }
    })
  }
)
