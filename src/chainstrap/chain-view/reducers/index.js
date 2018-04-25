import { combineReducers } from 'redux'

import tooltip from './tooltip'
import contract from './contract'

// Export root reducer
export default combineReducers({
  tooltip,
  contract
})
