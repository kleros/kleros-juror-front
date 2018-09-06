import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

// Shapes
const {
  shape: PNKBalanceShape,
  initialState: PNKBalanceInitialState
} = createResource(
  PropTypes.shape({
    tokenBalance: PropTypes.object.isRequired,
    activatedTokens: PropTypes.object.isRequired,
    lockedTokens: PropTypes.object.isRequired
  }),
  { withUpdate: true }
)
const {
  shape: arbitratorDataShape,
  initialState: arbitratorDataInitialState
} = createResource(
  PropTypes.shape({
    rngContractAddress: PropTypes.string.isRequired,
    pinakionContractAddress: PropTypes.string.isRequired,
    session: PropTypes.number.isRequired,
    period: PropTypes.number.isRequired,
    lastPeriodChange: PropTypes.number.isRequired,
    timePerPeriod: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    minActivatedToken: PropTypes.object.isRequired
  }),
  { withUpdate: true }
)
export { PNKBalanceShape, arbitratorDataShape }

// Reducer
export default createReducer({
  PNKBalance: PNKBalanceInitialState,
  arbitratorData: arbitratorDataInitialState
})
