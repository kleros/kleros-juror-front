import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

import * as contractActions from '../actions/contract'

import configureStore, { Provider } from './bootstrap/configure-store'
import { eth } from './bootstrap/dapp-api'
import RequiresMetaMask from './components/requires-meta-mask'
import logo from './assets/logo.png'
import DataProvenance from './containers/data-provenance'

import './bootstrap/fontawesome'
import './chain-view.css'

export const store = configureStore()

export default class ChainView extends PureComponent {
  static propTypes = {
    // State
    children: PropTypes.element.isRequired,

    // Handlers
    receiveAccounts: PropTypes.func
  }

  static defaultProps = {
    // Handlers
    receiveAccounts: null
  }

  state = {
    loading: true,
    needsUnlock: true,
    isOpen: false,
    toggledTabName: null
  }

  async componentDidMount() {
    const { receiveAccounts, initialContracts } = this.props

    const accounts = await eth.accounts()
    receiveAccounts && receiveAccounts(accounts)
    this.setState({ loading: false, needsUnlock: !accounts || !accounts[0] })

    initialContracts &&
      initialContracts.forEach(c =>
        store.dispatch(contractActions.addContract(c))
      )
  }

  handleToggleClick = () =>
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))

  handleTabToggleClick = ({ currentTarget: { id } }) =>
    this.setState(prevState => ({
      toggledTabName: prevState.toggledTabName === id ? null : id
    }))

  render() {
    const { children } = this.props
    const { loading, needsUnlock, isOpen, toggledTabName } = this.state

    // Web3 not loaded
    if (eth.accounts === undefined) return <RequiresMetaMask />

    // Loading accounts
    if (loading) return null

    // Web3 locked
    if (needsUnlock) return <RequiresMetaMask needsUnlock />

    return (
      <Provider store={store}>
        <div style={{ height: '100%', width: '100%' }}>
          <div className="ChainView">
            <div
              className={`ChainView-toggle ${isOpen ? 'is-open' : ''}`}
              onClick={this.handleToggleClick}
            >
              <img
                className="ChainView-toggle-image"
                src={logo}
                alt="ChainStrap Logo"
              />
            </div>
            <div className={`ChainView-panel ${isOpen ? 'is-open' : ''}`}>
              <h2 className="ChainView-panel-title">ChainView</h2>
              {[{ name: 'Data Provenance', Component: DataProvenance }].map(
                t => {
                  const isToggled = toggledTabName === t.name
                  return (
                    <div key={t.name} className="ChainView-panel-tab">
                      <h4
                        id={t.name}
                        className="ChainView-panel-tab-title"
                        onClick={this.handleTabToggleClick}
                      >
                        {t.name}
                        <div
                          className={`ChainView-panel-tab-title-toggle ${
                            isToggled ? 'is-toggled' : ''
                          }`}
                        >
                          >
                        </div>
                      </h4>
                      {isToggled && (
                        <div className="ChainView-panel-tab-content">
                          <t.Component />
                        </div>
                      )}
                    </div>
                  )
                }
              )}
            </div>
          </div>
          {children}
          <ReactTooltip id="chainView" />
        </div>
      </Provider>
    )
  }
}
