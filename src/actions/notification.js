import { createActions } from '../utils/redux'

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

/* Action Creators */

// Notifications
export const fetchNotifications = () => ({ type: notifications.FETCH })

// Notification
export const dismissNotification = (txHash, logIndex) => ({
  type: notification.DISMISS,
  payload: { txHash, logIndex }
})
