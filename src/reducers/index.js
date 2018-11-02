import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as toastr } from 'react-redux-toastr'
import { reducer as form } from 'redux-form'

import wallet from './wallet'
import notification from './notification'
import arbitrator from './arbitrator'
import dispute from './dispute'
import bondingCurve from './bonding-curve'

// Export root reducer
export default combineReducers({
  router,
  toastr,
  form,
  wallet,
  notification,
  arbitrator,
  dispute,
  bondingCurve
})
