/* Actions */
export const SET_CHAIN_DATA = 'SET_CHAIN_DATA'

/* Action Creators */
export const setChainData = chainData => ({
  type: SET_CHAIN_DATA,
  payload: { chainData }
})
