import { createActions } from 'lessdux'

/* Actions */

export const bondingCurve = {
  ...createActions('BONDING_CURVE_TOTALS', { withUpdate: true }),
  BUY_PNK: 'BUY_PNK_FROM_BONDING_CURVE',
  SELL_PNK: 'SELL_PNK_FROM_BONDING_CURVE'
}

/* Action Creators */

export const buyPNKFromBondingCurve = amount => ({
  type: bondingCurve.BUY_PNK,
  payload: { amount }
})
export const sellPNKToBondingCurve = amount => ({
  type: bondingCurve.SELL_PNK,
  payload: { amount }
})
export const fetchBondingCurveData = () => ({
  type: bondingCurve.FETCH
})
