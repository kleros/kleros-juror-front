import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router-dom'

import appStore from '..'

import * as walletActions from '../actions/wallet'
import ChainView from '../chainstrap'
import NavBar from '../components/nav-bar'
import Home from '../containers/home'
import Disputes from '../containers/disputes'
import Dispute from '../containers/dispute'
import TestingPanel from '../containers/testing-panel'
import PageNotFound from '../components/page-not-found'

import { ARBITRATOR_ADDRESS } from './dapp-api'
import GlobalComponents from './global-components'

import './app.css'

const receiveAccounts = accounts =>
  appStore.dispatch(walletActions.receiveAccounts(accounts))

const ConnectedNavBar = connect(state => ({ accounts: state.wallet.accounts }))(
  ({ accounts }) => (
    <NavBar
      accounts={accounts}
      routes={[
        { name: 'Home', to: '/' },
        { name: 'Disputes', to: '/disputes' },
        { name: 'Testing Panel', to: '/testing-panel' }
      ]}
    />
  )
)

const App = ({ store, history, testElement }) => (
  <Provider store={store}>
    <ChainView
      receiveAccounts={receiveAccounts}
      initialContracts={[{ name: 'Arbitrator', address: ARBITRATOR_ADDRESS }]}
    >
      <ConnectedRouter history={history}>
        <div id="router-root">
          <Helmet>
            <title>Kleros Dapp</title>
          </Helmet>
          <Route exact path="*" component={ConnectedNavBar} />
          <div id="scroll-root">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/disputes" component={Disputes} />
              <Route exact path="/disputes/:disputeID" component={Dispute} />
              <Route exact path="/testing-panel" component={TestingPanel} />
              <Route component={PageNotFound} />
            </Switch>
          </div>
          {testElement}
          <Route exact path="*" component={GlobalComponents} />
        </div>
      </ConnectedRouter>
    </ChainView>
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
  // Testing
  testElement: null
}

export default App
