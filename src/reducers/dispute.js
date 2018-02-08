import PropTypes from 'prop-types'

import createReducer, { createResource } from '../utils/redux'

// Shapes
const {
  shape: disputesShape,
  initialState: disputesInitialState
} = createResource(PropTypes.arrayOf(PropTypes.string))
const {
  shape: disputeShape,
  initialState: disputeInitialState
} = createResource(PropTypes.arrayOf(PropTypes.string))
export { disputesShape, disputeShape }

// Reducer
export default createReducer({
  disputes: disputesInitialState,
  dispute: disputeInitialState
})

// Selectors
