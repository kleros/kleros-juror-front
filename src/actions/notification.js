import { createActions } from 'lessdux'

/* Actions */

// Notifications
export const notifications = createActions('NOTIFICATIONS')

// Notification
export const notification = {
  ...createActions('NOTIFICATION', {
    withUpdate: true
  }),
  DISMISS: 'DISMISS_NOTIFICATION'
}

// Pending Actions
export const pendingActions = createActions('PENDING_ACTIONS')

/* Action Creators */

// Notifications
export const fetchNotifications = () => ({ type: notifications.FETCH })

// Notification
export const dismissNotification = (txHash, logIndex) => ({
  type: notification.DISMISS,
  payload: { txHash, logIndex }
})

// Pending Actions
export const fetchPendingActions = () => ({ type: pendingActions.FETCH })
