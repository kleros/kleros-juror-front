import { bindActionCreators } from 'redux'

import { store } from '../chain-view'

import { addContract as _addContract } from './contract'

export const addContract = bindActionCreators(_addContract, store.dispatch)
