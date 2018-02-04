import PropTypes from 'prop-types'

import createReducer, { createResource } from '../utils/redux'

// Shapes
const {
  shape: disputesShape,
  initialState: disputesInitialState
} = createResource(PropTypes.arrayOf(PropTypes.string))
export { disputesShape }

// Reducer
export default createReducer({
  disputes: disputesInitialState
})

// Selectors
