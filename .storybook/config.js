import React from 'react'
import { configure, addDecorator } from '@storybook/react'
import { host } from 'storybook-host'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { reducer as toastr } from 'react-redux-toastr'

import GlobalComponents from '../src/bootstrap/global-components'

import '../src/bootstrap/app.css'

// Storybook Host
addDecorator(
  host({
    title: 'Kleros UI-Kit',
    align: 'center middle'
  })
)

// Integration Wrapper
const store = createStore(combineReducers({ toastr }))
addDecorator(story => (
  <Provider store={store}>
    <div>
      {console.log(store.getState())}
      <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
      <GlobalComponents />
    </div>
  </Provider>
))

// Configure
configure(() => require('../stories/index.js'), module)
