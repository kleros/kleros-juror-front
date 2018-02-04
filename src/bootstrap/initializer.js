import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletSelectors from '../reducers/wallet'
import * as walletActions from '../actions/wallet'
import { renderIf } from '../utils/redux'
import RequiresMetaMask from '../components/requires-meta-mask'

import { eth } from './dapp-api'

class Initializer extends PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element.isRequired)
    ]).isRequired,
    accounts: walletSelectors.accountsShape.isRequired,
    fetchAccounts: PropTypes.func.isRequired
  }

  state = { isWeb3Loaded: eth.accounts !== undefined }

  componentDidMount() {
    const { fetchAccounts } = this.props
    fetchAccounts()
  }

  render() {
    const { isWeb3Loaded } = this.state
    const { accounts, children } = this.props

    return renderIf(
      accounts,
      {
        loading: 'Loading accounts...',
        done: children,
        failedLoading: <RequiresMetaMask needsUnlock={isWeb3Loaded} />
      },
      {
        extraValues: [accounts.data && accounts.data[0]],
        extraFailedValues: [!isWeb3Loaded]
      }
    )
  }
}

export default connect(
  state => ({
    accounts: state.wallet.accounts
  }),
  { fetchAccounts: walletActions.fetchAccounts }
)(Initializer)
