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
import { action, errorAction } from '../utils/action'

/**
 * Listens for push notifications.
 */
export function* pushNotificationsListener() {
  // Start after fetching whole list of notifications
  while (yield take(notificationActions.notifications.FETCH)) {
    const account = yield select(walletSelectors.getAccount) // Current account

    // Set up event channel with subscriber
    const channel = eventChannel(emitter => {
      kleros.watchForEvents(ARBITRATOR_ADDRESS, account, notification =>
        emitter(notification)
      )

      return kleros.eventListener.clearArbitratorHandlers // Unsubscribe function
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
export function* fetchNotifications() {
  try {
    const account = yield select(walletSelectors.getAccount)
    const notifications = yield call(
      kleros.notifications.getNotifications,
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
 * The root of the notification saga.
 */
export default function* notificationSaga() {
  // Listeners
  yield fork(pushNotificationsListener)

  // Notifications
  yield takeLatest(notificationActions.notifications.FETCH, fetchNotifications)
}
