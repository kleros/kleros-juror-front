import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'

import * as walletSelectors from '../../reducers/wallet'
import * as walletActions from '../../actions/wallet'
import * as arbitratorSelectors from '../../reducers/arbitrator'
import * as arbitratorActions from '../../actions/arbitrator'
import { renderIf } from '../../utils/redux'
import Identicon from '../../components/identicon'
import BalancePieChart from '../../components/balance-pie-chart'
import Button from '../../components/button'
import NotificationCard from '../../components/notification-card'
import DisputeCard from '../../components/dispute-card'
import { PERIOD_ENUM } from '../../constants/arbitrator'

import {
  ActivatePNKForm,
  getActivatePNKFormIsInvalid,
  submitActivatePNKForm
} from './components/activate-pnk-form'

import './home.css'

class Home extends PureComponent {
  static propTypes = {
    // Redux State
    accounts: walletSelectors.accountsShape.isRequired,
    balance: walletSelectors.balanceShape.isRequired,
    PNKBalance: arbitratorSelectors.PNKBalanceShape.isRequired,
    arbitratorData: arbitratorSelectors.arbitratorDataShape.isRequired,

    // Action Dispatchers
    fetchBalance: PropTypes.func.isRequired,
    fetchPNKBalance: PropTypes.func.isRequired,
    activatePNK: PropTypes.func.isRequired,
    fetchArbitratorData: PropTypes.func.isRequired,

    // activatePNKForm
    activatePNKFormIsInvalid: PropTypes.bool.isRequired,
    submitActivatePNKForm: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fetchBalance, fetchPNKBalance, fetchArbitratorData } = this.props
    fetchBalance()
    fetchPNKBalance()
    fetchArbitratorData()
  }

  handleActivateFormButtonClick = () => {
    const { activatePNKFormIsInvalid, submitActivatePNKForm } = this.props
    if (activatePNKFormIsInvalid)
      return toastr.error('A valid amount is required.')

    submitActivatePNKForm()
  }

  handleActivateButtonClick = () => {
    toastr.confirm(null, {
      component: () => {
        const { activatePNKFormIsInvalid, activatePNK } = this.props
        return (
          <div>
            <ActivatePNKForm onSubmit={activatePNK} />
            <Button
              onClick={this.handleActivateFormButtonClick}
              disabled={activatePNKFormIsInvalid}
            >
              Activate
            </Button>
          </div>
        )
      },
      okText: 'Close',
      disableCancel: true
    })
  }

  render() {
    const { accounts, balance, PNKBalance, arbitratorData } = this.props

    return (
      <div className="Home">
        <h4>Welcome to Kleros!</h4>
        <div className="Home-stats">
          <div className="Home-stats-block">
            {renderIf(accounts, {
              loading: 'Loading account...',
              done: (
                <div className="Home-stats-block-content">
                  <Identicon seed={accounts.data[0]} size={20} />
                  <div className="Home-stats-block-content-header">
                    <h5>{accounts.data[0].slice(0, 7)}...</h5>
                    {renderIf(PNKBalance, {
                      loading: '...',
                      done: PNKBalance.data && (
                        <h6>{PNKBalance.data.tokenBalance} PNK</h6>
                      ),
                      failedLoading: '...'
                    })}
                    {renderIf(balance, {
                      loading: '...',
                      done: <h6>{balance.data} ETH</h6>,
                      failedLoading: '...'
                    })}
                  </div>
                </div>
              ),
              failedLoading: 'There was an error fetching your account.'
            })}
          </div>
          <div className="Home-stats-block">
            {renderIf(PNKBalance, {
              loading: '...',
              done: PNKBalance.data && (
                <div className="Home-stats-block-content">
                  <BalancePieChart
                    type="activated"
                    balance={PNKBalance.data.activatedTokens}
                    total={PNKBalance.data.tokenBalance}
                    size={80}
                  />
                  <div className="Home-stats-block-content-header">
                    <h5>
                      Activated{renderIf(arbitratorData, {
                        loading: null,
                        done:
                          arbitratorData.data &&
                          PERIOD_ENUM[arbitratorData.data.period] ===
                            'activation' ? (
                            <Button
                              onClick={this.handleActivateButtonClick}
                              className="Home-stats-block-content-header-activateButton"
                              labelClassName="Home-stats-block-content-header-activateButton-label"
                            >
                              +
                            </Button>
                          ) : null,
                        error: null
                      })}
                    </h5>
                    <h6>{PNKBalance.data.activatedTokens} PNK</h6>
                  </div>
                </div>
              ),
              failedLoading: '...'
            })}
          </div>
          <div className="Home-stats-block">
            {renderIf(PNKBalance, {
              loading: '...',
              done: PNKBalance.data && (
                <div className="Home-stats-block-content">
                  <BalancePieChart
                    type="locked"
                    balance={PNKBalance.data.lockedTokens}
                    total={PNKBalance.data.tokenBalance}
                    size={80}
                  />
                  <div className="Home-stats-block-content-header">
                    <h5>Locked</h5>
                    <h6>{PNKBalance.data.lockedTokens} PNK</h6>
                  </div>
                </div>
              ),
              failedLoading: '...'
            })}
          </div>
        </div>
        <div className="Home-separatorHeader">
          <h4>Notifications</h4>
        </div>
        <div className="Home-cardList">
          <div className="Home-cardList-card">
            <NotificationCard message="This is a notification card." />
          </div>
          <div className="Home-cardList-card">
            <NotificationCard message="This is a notification card." />
          </div>
          <div className="Home-cardList-card">
            <NotificationCard message="This is a notification card." />
          </div>
          <div className="Home-cardList-card">
            <NotificationCard message="This is a notification card." />
          </div>
          <div className="Home-cardList-card">
            <NotificationCard message="This is a notification card." />
          </div>
        </div>
        <div className="Home-separatorHeader">
          <h4>Pending Actions</h4>
        </div>
        <div className="Home-cardList">
          <div className="Home-cardList-card">
            <DisputeCard
              status={0}
              subcourt="SUBCOURT"
              date={new Date(Date.now() - 1e10)}
              title="Unknown Website Owner Claims Services Were Not Delivered"
            />
          </div>
          <div className="Home-cardList-card">
            <DisputeCard
              status={0}
              subcourt="SUBCOURT"
              date={new Date(Date.now() - 1e10)}
              title="Unknown Website Owner Claims Services Were Not Delivered"
            />
          </div>
          <div className="Home-cardList-card">
            <DisputeCard
              status={0}
              subcourt="SUBCOURT"
              date={new Date(Date.now() - 1e10)}
              title="Unknown Website Owner Claims Services Were Not Delivered"
            />
          </div>
          <div className="Home-cardList-card">
            <DisputeCard
              status={0}
              subcourt="SUBCOURT"
              date={new Date(Date.now() - 1e10)}
              title="Unknown Website Owner Claims Services Were Not Delivered"
            />
          </div>
          <div className="Home-cardList-card">
            <DisputeCard
              status={0}
              subcourt="SUBCOURT"
              date={new Date(Date.now() - 1e10)}
              title="Unknown Website Owner Claims Services Were Not Delivered"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    accounts: state.wallet.accounts,
    balance: state.wallet.balance,
    PNKBalance: state.arbitrator.PNKBalance,
    arbitratorData: state.arbitrator.arbitratorData,
    activatePNKFormIsInvalid: getActivatePNKFormIsInvalid(state)
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    fetchPNKBalance: arbitratorActions.fetchPNKBalance,
    activatePNK: arbitratorActions.activatePNK,
    fetchArbitratorData: arbitratorActions.fetchArbitratorData,
    submitActivatePNKForm
  }
)(Home)
