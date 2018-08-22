import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import ChainView from '../chainstrap'
import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import RequiresMetaMask from '../components/requires-meta-mask'
import MissingArbitrator from '../components/missing-arbitrator'
import * as chainViewConstants from '../constants/chain-view'

import { ARBITRATOR_ADDRESS, initializeKleros } from './dapp-api'

class Initializer extends PureComponent {
  static propTypes = {
    // Redux State
    accounts: walletSelectors.accountsShape.isRequired,

    // Action Dispatchers
    fetchAccounts: PropTypes.func.isRequired,

    // State
    children: PropTypes.node.isRequired
  }

  state = { initialized: false }

  async componentDidMount() {
    const { fetchAccounts } = this.props

    await initializeKleros() // Kleros must be initialized before fetchAccounts as accounts trigger notification sagas
    fetchAccounts()

    this.setState({ initialized: true })
  }

  render() {
    const { accounts, children } = this.props
    const { initialized } = this.state

    if (initialized && !accounts.loading) {
      if (!window.web3) return <RequiresMetaMask />
      if (!accounts.data) return <RequiresMetaMask needsUnlock />
      if (!ARBITRATOR_ADDRESS) return <MissingArbitrator />

      return (
        <ChainView
          accounts={accounts.data}
          initialContracts={[
            {
              name: chainViewConstants.KLEROS_POC_NAME,
              address: ARBITRATOR_ADDRESS,
              color: chainViewConstants.KLEROS_POC_COLOR
            }
          ]}
        >
          {children}
        </ChainView>
      )
    }
    return (
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Loading...</span>
    )
  }
}

export default withRouter(
  connect(
    state => ({
      accounts: state.wallet.accounts
    }),
    { fetchAccounts: walletActions.fetchAccounts }
  )(Initializer)
)
