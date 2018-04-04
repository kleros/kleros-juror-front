import { combineReducers } from 'redux'

import contract from './contract'
import dataProvenance from './data-provenance'

// Export root reducer
export default combineReducers({
  contract,
  dataProvenance
})
