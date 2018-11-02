import { takeLatest, call, select } from 'redux-saga/effects'

import * as bondingCurveActions from '../actions/bonding-curve'
import * as walletSelectors from '../reducers/wallet'
import { bondingCurve } from '../bootstrap/dapp-api'
import { lessduxSaga } from '../utils/saga'

/**
 * Fetch reserve parameters of the bonding curve.
 * @returns {object} { totalETH, totalPNK, spread } all keys map to big number objects.
 */
function* fetchBondingCurveTotals() {
  return {
    totalETH: yield call(bondingCurve.getTotalETH),
    totalPNK: yield call(bondingCurve.getTotalTKN),
    spread: yield call(bondingCurve.getSpread)
  }
}

/**
 * Buy PNK from the bonding curve.
 * @param {string} amount The amount of ETH the user has input.
 * @returns {object} Updated reserve parameters of the bonding curve.
 */
function* buyPNKFromBondingCurve({ payload: { amount } }) {
  const addr = yield select(walletSelectors.getAccount)
  yield call(bondingCurve.buy, addr, 0, amount, addr)
  return yield fetchBondingCurveTotals()
}

/**
 * Sell PNK to the bonding curve.
 * @param {string} amount The amount of PNK the user has input.
 * @returns {object} Updated reserve parameters of the bonding curve.
 */
function* sellPNKToBondingCurve({ payload: { amount } }) {
  const addr = yield select(walletSelectors.getAccount)
  yield call(bondingCurve.sell, amount, addr, 0, addr)
  return yield fetchBondingCurveTotals()
}

/**
 * The root of the bonding curve saga.
 */
export default function* bondingCurveSaga() {
  yield takeLatest(
    bondingCurveActions.bondingCurve.FETCH,
    lessduxSaga,
    'fetch',
    bondingCurveActions.bondingCurve,
    fetchBondingCurveTotals
  )
  yield takeLatest(
    bondingCurveActions.bondingCurve.BUY_PNK,
    lessduxSaga,
    'update',
    bondingCurveActions.bondingCurve,
    buyPNKFromBondingCurve
  )
  yield takeLatest(
    bondingCurveActions.bondingCurve.SELL_PNK,
    lessduxSaga,
    'update',
    bondingCurveActions.bondingCurve,
    sellPNKToBondingCurve
  )
}
