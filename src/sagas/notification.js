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

import * as notificationSelectors from '../reducers/notification'
import * as notificationActions from '../actions/notification'
import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import { kleros, ARBITRATOR_ADDRESS } from '../bootstrap/dapp-api'
import { action, errorAction } from '../utils/action'

/**
 * Listens for push notifications.
 */
function* pushNotificationsListener() {
  // Start after fetching whole list of notifications
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
        action(notificationActions.notification.RECEIVE, { notification })
      )
    }

    // We changed accounts, so close the channel. This calls unsubscribe under the hood which clears handlers for the old account
    channel.close()
  }
}

/**
 * Fetches the current account's notifications.
 */
function* fetchNotifications() {
  try {
    const account = yield select(walletSelectors.getAccount)
    const notifications = yield call(
      kleros.notifications.getUnreadNotifications,
      account
    )

    yield put(
      action(notificationActions.notifications.RECEIVE, { notifications })
    )
  } catch (err) {
    yield put(errorAction(notificationActions.notifications.FAIL_FETCH, err))
  }
}

/**
 * Dismisses a notification.
 */
function* dismissNotification({ payload: { txHash, logIndex } }) {
  try {
    yield put(action(notificationActions.notification.UPDATE))

    yield call(
      kleros.notifications.markNotificationAsRead,
      yield select(walletSelectors.getAccount),
      txHash,
      logIndex
    )

    const notifications = (yield select(
      notificationSelectors.getNotifications
    )).data.filter(n => n.txHash !== txHash || n.logIndex !== logIndex)

    yield put(
      action(notificationActions.notification.RECEIVE_UPDATED, {
        notifications
      })
    )
  } catch (err) {
    yield put(errorAction(notificationActions.notification.FAIL_UPDATE, err))
  }
}

/**
 * Fetches the current account's pending actions.
 */
function* fetchPendingActions() {
  try {
    const account = yield select(walletSelectors.getAccount)
    const pendingActions = yield call(
      kleros.notifications.getStatefulNotifications,
      ARBITRATOR_ADDRESS,
      account
    )
    console.log(pendingActions)
    yield put(
      action(notificationActions.pendingActions.RECEIVE, { pendingActions })
    )
  } catch (err) {
    yield put(errorAction(notificationActions.pendingActions.FAIL_FETCH, err))
  }
}

/**
 * The root of the notification saga.
 */
export default function* notificationSaga() {
  // Listeners
  yield fork(pushNotificationsListener)

  // Notifications
  yield takeLatest(notificationActions.notifications.FETCH, fetchNotifications)

  // Notification
  yield takeLatest(
    notificationActions.notification.DISMISS,
    dismissNotification
  )

  // Pending Actions
  yield takeLatest(
    notificationActions.pendingActions.FETCH,
    fetchPendingActions
  )
}
