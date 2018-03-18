import { eventChannel } from 'redux-saga'

import {
  fork,
  take,
  race,
  takeLatest,
  select,
  call,
  put
} from 'redux-saga/effects'

import * as notificationActions from '../actions/notification'
import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import { kleros, ARBITRATOR_ADDRESS } from '../bootstrap/dapp-api'
import { action } from '../utils/action'
import { fetchSaga, updateSaga } from '../utils/saga'

/**
 * Listens for push notifications.
 */
function* pushNotificationsListener() {
  // Start after fetching all notifications
  while (yield take(notificationActions.notifications.FETCH)) {
    const account = yield select(walletSelectors.getAccount) // Current account

    // Set up event channel with subscriber
    const channel = eventChannel(emitter => {
      kleros.watchForEvents(ARBITRATOR_ADDRESS, account, notification =>
        emitter(notification)
      )

      return kleros.eventListener.stopWatchingArbitratorEvents // Unsubscribe function
    })

    // Keep listening while on the same account
    while (account === (yield select(walletSelectors.getAccount))) {
      const [notification, accounts] = yield race([
        take(channel), // New notifications
        take(walletActions.accounts.RECEIVE) // Accounts refetch
      ])
      if (accounts) continue // Possible account change

      // Put new notification
      yield put(
        action(notificationActions.notification.RECEIVE, {
          collectionMod: {
            collection: notificationActions.notifications.self,
            resource: notification
          }
        })
      )
    }

    // We changed accounts, so close the channel. This calls unsubscribe under the hood which clears handlers for the old account
    channel.close()
  }
}

/**
 * Fetches the current account's notifications.
 * @returns {object[]} - The notifications.
 */
function* fetchNotifications() {
  return yield call(
    kleros.notifications.getUnreadNotifications,
    yield select(walletSelectors.getAccount)
  )
}

/**
 * Dismisses a notification.
 * @returns {object[]} - The updated notifications list.
 */
function* dismissNotification({ payload: { txHash, logIndex } }) {
  yield call(
    kleros.notifications.markNotificationAsRead,
    yield select(walletSelectors.getAccount),
    txHash,
    logIndex
  )
  return {
    collection: notificationActions.notifications.self,
    find: n => n.txHash === txHash && n.logIndex === logIndex
  }
}

/**
 * Fetches the current account's pending actions.
 * @returns {object[]} - The pending actions.
 */
function* fetchPendingActions() {
  return yield call(
    kleros.notifications.getStatefulNotifications,
    ARBITRATOR_ADDRESS,
    yield select(walletSelectors.getAccount)
  )
}

/**
 * The root of the notification saga.
 */
export default function* notificationSaga() {
  // Listeners
  yield fork(pushNotificationsListener)

  // Notifications
  yield takeLatest(
    notificationActions.notifications.FETCH,
    fetchSaga,
    notificationActions.notifications,
    fetchNotifications
  )

  // Notification
  yield takeLatest(
    notificationActions.notification.DISMISS,
    updateSaga,
    notificationActions.notification,
    dismissNotification
  )

  // Pending Actions
  yield takeLatest(
    notificationActions.pendingActions.FETCH,
    fetchSaga,
    notificationActions.pendingActions,
    fetchPendingActions
  )
}
