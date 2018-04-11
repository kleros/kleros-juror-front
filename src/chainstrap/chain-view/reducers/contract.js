import PropTypes from 'prop-types'
import createReducer from 'lessdux'
import { createSelector } from 'reselect'

import * as contractActions from '../../actions/contract'

// Shapes
export const contractShape = PropTypes.shape({
  // Meta Data
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,

  // Data Provenance
  visibleDataProvenance: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,

  // Transactions
  visibleTransactions: PropTypes.bool.isRequired
})

// Reducer
export default createReducer(
  {},
  {
    [contractActions.ADD_CONTRACT]: (state, { payload: { contract } }) => ({
      ...state,
      [contract.address]: {
        id: contract.address,
        visibleDataProvenance: false,
        color: '#ff0000',
        visibleTransactions: false,
        ...contract
      }
    }),
    [contractActions.SET_CONTRACT_VISIBILITY]: (
      state,
      { payload: { address, visible, dataProvenance } }
    ) => ({
      ...state,
      [address]: {
        ...state[address],
        [`visible${
          dataProvenance ? 'DataProvenance' : 'Transactions'
        }`]: visible
      }
    }),
    [contractActions.SET_CONTRACT_COLOR]: (
      state,
      { payload: { address, color } }
    ) => ({ ...state, [address]: { ...state[address], color: color } })
  }
)

// Selectors
export const getContracts = createSelector(
  state => state.contract,
  contracts => Object.values(contracts)
)
