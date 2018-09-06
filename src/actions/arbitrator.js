import { createActions } from 'lessdux'

/* Actions */

// PNK Balance
export const PNKBalance = {
  ...createActions('$PNK$_BALANCE', { withUpdate: true }),
  BUY: 'BUY_PNK',
  ACTIVATE: 'ACTIVATE_PNK',
  TRANSFER: 'TRANSFER_PNK',
  WITHDRAW: 'WITHDRAW_PNK'
}

// Arbitrator Data
export const arbitratorData = {
  ...createActions('ARBITRATOR_DATA', { withUpdate: true }),
  PASS_PERIOD: 'PASS_PERIOD'
}

/* Action Creators */

// PNK Balance
export const fetchPNKBalance = () => ({ type: PNKBalance.FETCH })
export const buyPNK = amount => ({
  type: PNKBalance.BUY,
  payload: { amount }
})
export const activatePNK = amount => ({
  type: PNKBalance.ACTIVATE,
  payload: { amount }
})
export const transferPNK = amount => ({
  type: PNKBalance.TRANSFER,
  payload: { amount }
})
export const withdrawPNK = amount => ({
  type: PNKBalance.WITHDRAW,
  payload: { amount }
})

// Arbitrator Data
export const fetchArbitratorData = () => ({ type: arbitratorData.FETCH })
export const passPeriod = () => ({ type: arbitratorData.PASS_PERIOD })
