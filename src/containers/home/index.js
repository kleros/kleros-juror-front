import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as walletActions from '../../actions/wallet'
import * as walletSelectors from '../../reducers/wallet'
import * as disputeActions from '../../actions/dispute'
import * as disputeSelectors from '../../reducers/dispute'
import { renderIf } from '../../utils/react-redux'
import Identicon from '../../components/identicon'

import './home.css'

class Home extends PureComponent {
  static propTypes = {
    balance: walletSelectors.balanceShape.isRequired,
    disputes: disputeSelectors.disputesShape.isRequired,
    fetchBalance: PropTypes.func.isRequired,
    fetchDisputes: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fetchBalance, fetchDisputes } = this.props
    fetchBalance()
    fetchDisputes()
  }

  render() {
    const { balance, disputes } = this.props

    return (
      <div className="Home">
        <div className="Home-message">
          <b>Hello CryptoWorld</b>
        </div>
        <br />
        <br />
        <div className="Home-message">
          {renderIf(
            [balance.loading],
            [balance.data],
            [balance.failedLoading],
            {
              loading: 'Loading balance...',
              done: (
                <span>
                  Welcome <Identicon seed="Placeholder" />, You have{' '}
                  {balance.data && balance.data.toString()} ETH.
                </span>
              ),
              failed: (
                <span>
                  There was an error fetching your balance. Make sure{' '}
                  <a
                    className="Home-message-link"
                    href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
                  >
                    MetaMask
                  </a>{' '}
                  is unlocked and refresh the page.
                </span>
              )
            }
          )}
        </div>
        <div className="Home-disputes">
          {renderIf(
            [disputes.loading],
            [disputes.data],
            [disputes.failedLoading],
            {
              loading: 'Loading disputes...',
              done: (
                <span>
                  {disputes.data &&
                    disputes.data.map(d => JSON.stringify(d, null, 2))}
                </span>
              ),
              failed: <span>There was an error fetching your disputes.</span>
            }
          )}
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    balance: state.wallet.balance,
    disputes: state.dispute.disputes
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    fetchDisputes: disputeActions.fetchDisputes
  }
)(Home)
