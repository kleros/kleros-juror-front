/* Actions */
export const ADD_CONTRACT = 'ADD_CONTRACT'
export const SET_CONTRACT_VISIBILITY = 'SET_CONTRACT_VISIBILITY'
export const SET_CONTRACT_COLOR = 'SET_CONTRACT_COLOR'

/* Action Creators */
export const addContract = contract => ({
  type: ADD_CONTRACT,
  payload: { contract }
})
export const setContractVisibility = (address, visible, dataProvenance) => ({
  type: SET_CONTRACT_VISIBILITY,
  payload: { address, visible, dataProvenance }
})
export const setContractColor = (address, color) => ({
  type: SET_CONTRACT_COLOR,
  payload: { address, color }
})
