/* eslint-disable global-require */
import { applyMiddleware, compose, createStore } from 'redux'
import { createProvider, connect as _connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'

import rootReducer from '../reducers'

export const Provider = createProvider('chainView')
export const connect = (
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  options
) =>
  _connect(mapStateToProps, mapDispatchToProps, mergeProps, {
    storeKey: 'chainView',
    ...options
  })

let store

/**
 * Sets up the redux store.
 * @param {object} [initialState={}] - The initial state for the redux store, defaults to an empty object.
 * @param {{ dispatchSpy: function }} [integrationTestParams=[]] - Parameters necessary to setup integration tests.
 * @returns {object} - The store.
 */
export default function configureStore(
  initialState = {},
  { dispatchSpy } = {}
) {
  const enhancers = []
  const middleware = []
  const composeEnhancers =
    process.env.NODE_ENV === 'development' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ name: 'ChainView' })
      : compose

  // Development Tools
  if (process.env.NODE_ENV === 'development') {
    const reduxImmutableState = require('redux-immutable-state-invariant')
      .default
    const reduxUnhandledAction = require('redux-unhandled-action').default
    middleware.push(
      reduxImmutableState(),
      reduxUnhandledAction(action =>
        console.error(
          `${action} didn't lead to creation of a new state object`,
          action
        )
      )
    )
  }

  // Testing Tools
  if (dispatchSpy)
    middleware.push(_store => next => action => {
      dispatchSpy(action)
      return next(action)
    })

  // Reattach tooltips if necessary
  middleware.push(store => next => action => {
    const prevState = store.getState()
    const result = next(action)
    if (prevState !== store.getState()) ReactTooltip.rebuild()
    return result
  })

  enhancers.unshift(applyMiddleware(...middleware))
  store = createStore(rootReducer, initialState, composeEnhancers(...enhancers))
  return store
}

if (module.hot)
  module.hot.accept('../reducers', () => {
    store.replaceReducer(rootReducer)
  })
