import { createActions } from 'lessdux'

/* Actions */

export const bondingCurve = {
  ...createActions('BONDING_CURVE_TOTALS', { withUpdate: true }),
  BUY_PNK: 'BUY_PNK_FROM_BONDING_CURVE',
  SELL_PNK: 'SELL_PNK_FROM_BONDING_CURVE',
  APPROVE_PNK: 'APPROVE_PNK_TO_BONDING_CURVE',
  APPROVE_PROGRESS: 'RECEIVE_APPROVE_TRANSACTION_PROGRESS'
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
export const approvePNKToBondingCurve = amount => ({
  type: bondingCurve.APPROVE_PNK,
  payload: { amount }
})
export const updateApproveTransactionProgress = approveTransactionProgress => ({
  type: bondingCurve.APPROVE_PROGRESS,
  payload: { approveTransactionProgress }
})
