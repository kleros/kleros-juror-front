import PropTypes from 'prop-types'

import createReducer from '../utils/create-reducer'
import { createShape } from '../utils/react-redux'

// Reducer
export default createReducer({
  disputes: {
    loading: false,
    data: null,
    failedLoading: false
  }
})

// Selectors

// Shapes
export const disputesShape = createShape(PropTypes.arrayOf(PropTypes.string))
