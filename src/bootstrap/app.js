import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Switch, Route } from 'react-router-dom'

import NavBar from '../components/nav-bar'
import Home from '../containers/home'
import Disputes from '../containers/disputes'

import Initializer from './initializer'
import GlobalComponents from './global-components'

import './app.css'

const renderNavBar = () => (
  <NavBar
    routes={[{ name: 'Home', to: '/' }, { name: 'Disputes', to: '/disputes' }]}
  />
)

const App = ({ store, history, testElement }) => (
  <Provider store={store}>
    <Initializer>
      <ConnectedRouter history={history}>
        <div id="router-root">
          <Helmet>
            <title>Kleros Dapp</title>
          </Helmet>
          <Route path="/" render={renderNavBar} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/disputes" component={Disputes} />
          </Switch>
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

  // Router
  history: PropTypes.shape({}).isRequired,

  // Testing
  testElement: PropTypes.element
}

App.defaultProps = {
  testElement: null
}

export default App
