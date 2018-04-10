import React from 'react'

import configureStore, { Provider } from './bootstrap/configure-store'
import ChainView from './containers/chain-view'

import './bootstrap/fontawesome'

export const store = configureStore()

export default props => (
  <Provider store={store}>
    <ChainView {...props} />
  </Provider>
)
