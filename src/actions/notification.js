import { createActions } from '../utils/redux'

/* Actions */

// Notifications
export const notifications = createActions('NOTIFICATIONS')

// Notification
export const notification = createActions('NOTIFICATION')

/* Action Creators */

// Notifications
export const fetchNotifications = () => ({ type: notifications.FETCH })
