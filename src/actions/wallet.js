import { createActions } from 'lessdux'

/* Actions */

// Accounts
export const accounts = createActions('ACCOUNTS')

// Balance
export const balance = createActions('BALANCE')

/* Action Creators */

// Accounts
export const fetchAccounts = () => ({ type: accounts.FETCH })
export const receiveAccounts = _accounts => ({
  type: accounts.RECEIVE,
  payload: { accounts: _accounts }
})

// Balance
export const fetchBalance = () => ({ type: balance.FETCH })
