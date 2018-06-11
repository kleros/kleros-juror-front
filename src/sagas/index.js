import { delay } from 'redux-saga'
import { toastr } from 'react-redux-toastr'

import { spawn, call, all } from 'redux-saga/effects'

import walletSaga from './wallet'
import notificationSaga from './notification'
import arbitratorSaga from './arbitrator'
import disputeSaga from './dispute'

/**
 * Makes a saga restart after an uncaught error.
 * @param {object} saga - A generator function.
 * @returns {object} - A new generator function with the added functionality.
 */
export function makeRestartable(saga) {
  return function*() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        yield call(saga)
        throw new Error(
          `Unexpected root saga termination. The root sagas are supposed to be sagas that live during the whole app lifetime! ${saga}`
        )
      } catch (err) {
        /* istanbul ignore if  */
        if (process.env.NODE_ENV !== 'test')
          console.info(
            'Saga error, the saga will be restarted after 3 seconds.',
            err
          )

        err.message &&
          toastr.info(
            'Your connection is unstable, please check your network and refresh the page.'
          )
        yield call(delay, 3000)
      }
    }
  }
}

const rootSagas = [
  walletSaga,
  notificationSaga,
  arbitratorSaga,
  disputeSaga
].map(makeRestartable)

/**
 * The root saga.
 */
export default function* rootSaga() {
  yield all(rootSagas.map(saga => spawn(saga)))
}
