import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider, connect } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router-dom'

import NavBar from '../components/nav-bar'
import Home from '../containers/home'
import Disputes from '../containers/disputes'
import Dispute from '../containers/dispute'
import Tokens from '../containers/tokens'
import PageNotFound from '../components/page-not-found'
import DogesOnTrialEvidence from '../components/iframes/doges-on-trial-evidence'

import Initializer from './initializer'
import GlobalComponents from './global-components'

import './app.css'

const ConnectedNavBar = connect(state => ({ accounts: state.wallet.accounts }))(
  ({ accounts }) => (
    <NavBar
      accounts={accounts}
      routes={[
        { name: 'Home', to: '/' },
        { name: 'Cases', to: '/cases' },
        { name: 'Tokens', to: '/tokens' },
        {
          name: 'Guide',
          to:
            'https://medium.com/kleros/doges-on-trial-pilot-explainer-911492c3a7d8',
          isExternal: true
        }
      ]}
    />
  )
)
const App = ({ store, history, testElement }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div id="router-root">
        <Helmet>
          <title>Kleros · Juror Dashboard</title>
        </Helmet>
        <Switch>
          <Route
            exact
            path="/evidence-display/doges-on-trial"
            component={DogesOnTrialEvidence}
          />
          <Route exact path="*">
            <Initializer>
              <Route exact path="*" component={ConnectedNavBar} />
              <div id="scroll-root">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/cases" component={Disputes} />
                  <Route exact path="/cases/:disputeID" component={Dispute} />
                  <Route exact path="/tokens" component={Tokens} />
                  <Route component={PageNotFound} />
                </Switch>
              </div>
              {testElement}
              <Route exact path="*" component={GlobalComponents} />
            </Initializer>
          </Route>
        </Switch>
      </div>
    </ConnectedRouter>
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
