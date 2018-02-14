import { addDecorator, configure } from '@storybook/react'
import { host } from 'storybook-host'
import React from 'react'
import { combineReducers, applyMiddleware, createStore } from 'redux'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import ReduxToastr, { reducer as toastr } from 'react-redux-toastr'

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
const store = createStore(
  combineReducers({
    toastr
  }),
  applyMiddleware(store => next => action => {
    console.log(action)
    return next(action)
  })
)
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
