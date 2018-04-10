import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { connect } from '../../bootstrap/configure-store'
import * as tooltipSelectors from '../../reducers/tooltip'
import * as contractActions from '../../../actions/contract'
import { eth } from '../../bootstrap/dapp-api'
import RequiresMetaMask from '../../components/requires-meta-mask'
import logo from '../../assets/logo.png'
import DataProvenance from '../data-provenance'
import ChainDataTooltip from '../../components/chain-data-tooltip'

import './chain-view.css'

class ChainView extends PureComponent {
  static propTypes = {
    // Redux State
    chainData: tooltipSelectors.chainDataShape,

    // Action Dispatchers
    addContract: PropTypes.func.isRequired,

    // State
    children: PropTypes.node.isRequired,
    initialContracts: PropTypes.arrayOf(
      PropTypes.shape({
        // Meta Data
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,

        // Data Provenance
        visible: PropTypes.bool,
        color: PropTypes.string
      }).isRequired
    ),

    // Callbacks
    onReceiveAccounts: PropTypes.func
  }

  static defaultProps = {
    // Redux State
    chainData: null,

    // State
    initialContracts: null,

    // Callbacks
    onReceiveAccounts: null
  }

  state = {
    loading: true,
    needsUnlock: true,
    isOpen: false,
    toggledTabName: null
  }

  async componentDidMount() {
    const { addContract, initialContracts, onReceiveAccounts } = this.props

    const accounts = await eth.accounts()
    onReceiveAccounts && onReceiveAccounts(accounts)

    accounts &&
      accounts.forEach((a, i) =>
        addContract({ name: `Account ${i + 1}`, address: a })
      )

    initialContracts && initialContracts.forEach(c => addContract(c))

    this.setState({ loading: false, needsUnlock: !accounts || !accounts[0] })
  }

  handleToggleClick = () =>
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))

  handleTabToggleClick = ({ currentTarget: { id } }) =>
    this.setState(prevState => ({
      toggledTabName: prevState.toggledTabName === id ? null : id
    }))

  handleOpenChainViewClick = () =>
    this.setState({ isOpen: true, toggledTabName: 'Data Provenance' })

  render() {
    const { chainData, children } = this.props
    const { loading, needsUnlock, isOpen, toggledTabName } = this.state

    // Web3 not loaded
    if (eth.accounts === undefined) return <RequiresMetaMask />

    // Loading accounts
    if (loading) return null

    // Web3 locked
    if (needsUnlock) return <RequiresMetaMask needsUnlock />

    return (
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
            <h3 className="ChainView-panel-title">ChainView</h3>
            {[{ name: 'Data Provenance', Component: DataProvenance }].map(t => {
              const isToggled = toggledTabName === t.name
              return (
                <div key={t.name} className="ChainView-panel-tab">
                  <h4
                    id={t.name}
                    className={`ChainView-panel-tab-title ${
                      isToggled ? 'is-toggled' : ''
                    }`}
                    onClick={this.handleTabToggleClick}
                  >
                    {t.name}
                    <div
                      className={`ChainView-panel-tab-title-toggle ${
                        isToggled ? 'is-toggled' : ''
                      }`}
                    >
                      <FontAwesomeIcon icon="caret-down" />
                    </div>
                  </h4>
                  {isToggled && (
                    <div
                      className={`ChainView-panel-tab-content ${
                        isToggled ? 'is-toggled' : ''
                      }`}
                    >
                      <t.Component />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        {children}
        <ReactTooltip id="chainView" />
        <ReactTooltip
          id="chainViewChainData"
          class="ChainDataTooltip"
          effect="solid"
          delayHide={1000}
        >
          {chainData && (
            <ChainDataTooltip
              data={chainData}
              onOpenChainViewClick={this.handleOpenChainViewClick}
            />
          )}
        </ReactTooltip>
      </div>
    )
  }
}

export default connect(state => ({ chainData: state.tooltip.chainData }), {
  addContract: contractActions.addContract
})(ChainView)
