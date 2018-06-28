import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ChainView from '../chainstrap'
import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import * as chainViewConstants from '../constants/chain-view'
import RequiresMetaMaskPage from '../components/requires-meta-mask'
import MissingArbitrator from '../components/missing-arbitrator'

import { _initializeKleros, arbitratorAddress } from './dapp-api'

class Initializer extends PureComponent {
  static propTypes = {
    // Redux State
    accounts: walletSelectors.accountsShape.isRequired,

    // Action Dispatchers
    fetchAccounts: PropTypes.func.isRequired,

    // State
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element.isRequired)
    ]).isRequired
  }

  state = {
    initialized: false
  }

  async componentDidMount() {
    const { fetchAccounts } = this.props
    // initialize kleros
    await _initializeKleros()
    // initialize accounts
    fetchAccounts()

    this.setState({
      initialized: true
    })
  }

  render() {
    const { accounts, children } = this.props
    const { initialized } = this.state

    if (initialized && !accounts.loading) {
      if (!accounts.data) return <RequiresMetaMaskPage needsUnlock />

      if (!arbitratorAddress) return <MissingArbitrator />

      return (
        <ChainView
          accounts={accounts.data}
          initialContracts={[
            {
              name: chainViewConstants.KLEROS_POC_NAME,
              address: arbitratorAddress,
              color: chainViewConstants.KLEROS_POC_COLOR
            }
          ]}
        >
          {children}
        </ChainView>
      )
    } else {
      return 'loading...'
    }
  }
}

export default connect(
  state => ({
    accounts: state.wallet.accounts
  }),
  { fetchAccounts: walletActions.fetchAccounts }
)(Initializer)
