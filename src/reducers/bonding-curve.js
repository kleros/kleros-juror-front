import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

import * as bondingCurve from '../api/bonding-curve'

// Shapes
const {
  shape: bondingCurveTotalsShape,
  initialState: bondingCurveInitialState
} = createResource(
  PropTypes.shape({
    totalETH: PropTypes.object.isRequired,
    totalPNK: PropTypes.object.isRequired
  }),
  { withUpdate: true }
)
export { bondingCurveTotalsShape }

// Reducers
/**
 * Compute the amount of PNKs that the bonding curve will return to the user
 * based on the amount of ETHs that the user inputs.
 * @param {object} state The original state.
 * @param {object} action The action object.
 * @returns {object} New state with the "estimatedPNK" key updated.
 */
function estimatePNK(state, action) {
  const estimatedPNK = bondingCurve.estimatePNK(
    action.payload.ETH,
    state.bondingCurveTotals.data.totalETH,
    state.bondingCurveTotals.data.totalPNK,
    state.bondingCurveTotals.data.spread
  )

  if (state.bondingCurveFormState.estimatedPNK === estimatedPNK) {
    return state
  }
  return Object.assign({}, state, {
    bondingCurveFormState: {
      estimatedPNK,
      estimatedETH: state.bondingCurveFormState.estimatedETH
    }
  })
}

/**
 * Compute the amount of ETHs that the bonding curve will give the user based on
 * the amount of PNKs that user inputs.
 * @param {object} state The original state.
 * @param {object} action The action object.
 * @returns {object} New state with the "estimatedETH" key updated.
 */
function estimateETH(state, action) {
  const estimatedETH = bondingCurve.estimateETH(
    action.payload.PNK,
    state.bondingCurveTotals.data.totalETH,
    state.bondingCurveTotals.data.totalPNK,
    state.bondingCurveTotals.data.spread
  )

  if (state.bondingCurveFormState.estimatedETH === estimatedETH) {
    return state
  }
  return Object.assign({}, state, {
    bondingCurveFormState: {
      estimatedETH,
      estimatedPNK: state.bondingCurveFormState.estimatedPNK
    }
  })
}

export default createReducer(
  {
    bondingCurveTotals: bondingCurveInitialState,
    bondingCurveFormState: {
      estimatedPNK: '0',
      estimatedETH: '0'
    }
  },
  {
    ESTIMATE_PNK_FROM_BONDING_CURVE: estimatePNK,
    ESTIMATE_ETH_FROM_BONDING_CURVE: estimateETH
  }
)
