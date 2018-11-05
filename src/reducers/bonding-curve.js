import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

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

export default createReducer({
  bondingCurveTotals: bondingCurveInitialState
})
