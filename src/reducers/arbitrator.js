import PropTypes from 'prop-types'

import createReducer, { createResource } from '../utils/redux'

// Shapes
const {
  shape: PNKBalanceShape,
  initialState: PNKBalanceInitialState
} = createResource(
  PropTypes.shape({
    tokenBalance: PropTypes.number.isRequired,
    activatedTokens: PropTypes.number.isRequired,
    lockedTokens: PropTypes.number.isRequired
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
    lastPeriodChange: PropTypes.number.isRequired
  }),
  { withUpdate: true }
)
export { PNKBalanceShape, arbitratorDataShape }

// Reducer
export default createReducer({
  PNKBalance: PNKBalanceInitialState,
  arbitratorData: arbitratorDataInitialState
})

// Selectors
