import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import { reducer as toastr } from 'react-redux-toastr'
import { reducer as form } from 'redux-form'

import { reducer as chainstrap } from '../chainstrap'

import wallet from './wallet'
import notification from './notification'
import arbitrator from './arbitrator'
import dispute from './dispute'

// Export root reducer
export default combineReducers({
  chainstrap,
  router,
  toastr,
  form,
  wallet,
  notification,
  arbitrator,
  dispute
})
