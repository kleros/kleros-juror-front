import PropTypes from 'prop-types'
import createReducer from 'lessdux'

import * as tooltipActions from '../../actions/tooltip'

// Shapes
export const chainDataShape = PropTypes.shape({
  contractName: PropTypes.string.isRequired,
  contractAddress: PropTypes.string.isRequired,
  functionSignature: PropTypes.string,
  parameters: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
  ),
  estimatedGas: PropTypes.number
})

// Reducer
export default createReducer(
  { chainData: null },
  {
    [tooltipActions.SET_CHAIN_DATA]: (state, action) => ({
      ...state,
      chainData: action.payload.chainData
    })
  }
)
