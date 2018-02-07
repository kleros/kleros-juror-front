import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router-dom'

import NavBar from '../components/nav-bar'
import Home from '../containers/home'
import Disputes from '../containers/disputes'
import TestingPanel from '../containers/testing-panel'
import PageNotFound from '../components/page-not-found'

import Initializer from './initializer'
import GlobalComponents from './global-components'

import './app.css'

const ConnectedNavBar = connect(state => ({ accounts: state.wallet.accounts }))(
  ({ accounts }) => (
    <NavBar
      routes={[
        { name: 'Home', to: '/' },
        { name: 'Disputes', to: '/disputes' },
        { name: 'Testing Panel', to: '/testing-panel' }
      ]}
      accounts={accounts}
    />
  )
)

const App = ({ store, history, testElement }) => (
  <Provider store={store}>
    <Initializer>
      <ConnectedRouter history={history}>
        <div id="router-root">
          <Helmet>
            <title>Kleros Dapp</title>
          </Helmet>
          <Route path="/" component={ConnectedNavBar} />
          <div id="scroll-root">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/disputes" component={Disputes} />
              <Route exact path="/testing-panel" component={TestingPanel} />
              <Route component={PageNotFound} />
            </Switch>
          </div>
          {testElement}
        </div>
      </ConnectedRouter>
      <GlobalComponents />
    </Initializer>
  </Provider>
)

App.propTypes = {
  // State
  store: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,

  // Testing
  testElement: PropTypes.element
}

App.defaultProps = {
  testElement: null
}

export default App
