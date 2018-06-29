import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { connect } from '../../bootstrap/configure-store'
import * as tooltipSelectors from '../../reducers/tooltip'
import * as contractActions from '../../../actions/contract'
import { eth } from '../../bootstrap/dapp-api'
import logo from '../../assets/images/logo.png'
import DataProvenance from '../data-provenance'
import Transactions from '../transactions'
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
    accounts: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    initialContracts: PropTypes.arrayOf(
      PropTypes.shape({
        // Meta Data
        id: PropTypes.string,
        name: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,

        // Data Provenance
        visibleDataProvenance: PropTypes.bool,
        color: PropTypes.string,

        // Transactions
        visibleTransactions: PropTypes.bool
      }).isRequired
    )
  }

  static defaultProps = {
    // Redux State
    chainData: null,

    // State
    initialContracts: null
  }

  state = {
    initialized: false,
    isOpen: false,
    toggledTabName: null
  }

  componentDidMount() {
    const { addContract, accounts, initialContracts } = this.props

    accounts &&
      accounts.forEach((a, i) =>
        addContract({
          name: `Account ${i + 1}`,
          address: a,
          color: '#ff9900'
        })
      )
    initialContracts && initialContracts.forEach(c => addContract(c))

    this.setState({ initialized: true })
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
    const { chainData, children, accounts } = this.props
    const { initialized, isOpen, toggledTabName } = this.state

    if (!initialized) return null
    if (eth.accounts === undefined) return 'Web3 not loaded.' // Web3 not loaded
    if (!accounts || !accounts[0]) return 'Web3 wallet needs unlock.' // Web3 locked

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
            {[
              { name: 'Data Provenance', Component: DataProvenance },
              { name: 'Transactions', Component: Transactions }
            ].map(t => {
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
        <ReactTooltip id="chainView" multiline html />
        <ReactTooltip
          id="chainViewChainData"
          class="ChainDataTooltip"
          effect="solid"
          delayHide={1000}
          multiline
          html
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

export default connect(
  state => ({ chainData: state.tooltip.chainData }),
  {
    addContract: contractActions.addContract
  }
)(ChainView)
