import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

import { bondingCurve } from '../actions/bonding-curve'

// Shapes
const {
  shape: bondingCurveTotalsShape,
  initialState: bondingCurveInitialState
} = createResource(
  PropTypes.shape({
    totalETH: PropTypes.object.isRequired,
    totalPNK: PropTypes.object.isRequired,
    allowance: PropTypes.object.isRequired
  }),
  { withUpdate: true }
)
export { bondingCurveTotalsShape }

/**
 * Reducer function that "sets" state.bondingCurveTotals.updating according to payload
 * @param {object} state - Original state.
 * @param {object} action - The action object.
 * @returns {object} - New state object.
 */
function setUpdating(state, action) {
  return {
    ...state,
    bondingCurveTotals: {
      ...state.bondingCurveTotals,
      updating: action.payload.updating
    }
  }
}

export default createReducer(
  {
    bondingCurveTotals: bondingCurveInitialState,
    approveTransactionProgress: { data: '' }
  },
  {
    // Buy and sell piggyback on bondingCurveTotals.updating to show loading indicator with RenderIf.
    [bondingCurve.SET_UPDATING]: setUpdating
  }
)
