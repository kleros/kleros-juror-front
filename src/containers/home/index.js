import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { toastr } from 'react-redux-toastr'

import * as walletSelectors from '../../reducers/wallet'
import * as walletActions from '../../actions/wallet'
import * as notificationSelectors from '../../reducers/notification'
import * as notificationActions from '../../actions/notification'
import * as arbitratorSelectors from '../../reducers/arbitrator'
import * as arbitratorActions from '../../actions/arbitrator'
import { RenderIf } from '../../utils/redux'
import Icosahedron from '../../components/icosahedron'
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
    notifications: notificationSelectors.notificationsShape.isRequired,
    pendingActions: notificationSelectors.pendingActionsShape.isRequired,
    PNKBalance: arbitratorSelectors.PNKBalanceShape.isRequired,
    arbitratorData: arbitratorSelectors.arbitratorDataShape.isRequired,

    // Action Dispatchers
    fetchBalance: PropTypes.func.isRequired,
    fetchNotifications: PropTypes.func.isRequired,
    fetchPendingActions: PropTypes.func.isRequired,
    dismissNotification: PropTypes.func.isRequired,
    fetchPNKBalance: PropTypes.func.isRequired,
    activatePNK: PropTypes.func.isRequired,
    fetchArbitratorData: PropTypes.func.isRequired,

    // activatePNKForm
    activatePNKFormIsInvalid: PropTypes.bool.isRequired,
    submitActivatePNKForm: PropTypes.func.isRequired
  }

  componentDidMount() {
    const {
      fetchBalance,
      fetchNotifications,
      fetchPendingActions,
      fetchPNKBalance,
      fetchArbitratorData
    } = this.props
    fetchBalance()
    fetchNotifications()
    fetchPendingActions()
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

  handleNotificationCardDismissClick = event => {
    const { notifications, dismissNotification } = this.props
    const { txHash, logIndex } = notifications.data.find(
      n => (n._id = event.currentTarget.id)
    )
    dismissNotification(txHash, logIndex)
  }

  render() {
    const {
      accounts,
      balance,
      notifications,
      pendingActions,
      PNKBalance,
      arbitratorData
    } = this.props

    return (
      <div className="Home">
        <h4>Welcome to Kleros!</h4>
        <div className="Home-stats">
          <div className="Home-stats-block">
            <RenderIf
              resource={accounts}
              loading={<Icosahedron />}
              done={
                <div className="Home-stats-block-content">
                  <Identicon seed={accounts.data[0]} size={20} />
                  <div className="Home-stats-block-content-header">
                    <h5>{accounts.data[0].slice(0, 7)}...</h5>
                    <RenderIf
                      resource={PNKBalance}
                      loading={<Icosahedron />}
                      done={
                        PNKBalance.data && (
                          <h6>{PNKBalance.data.tokenBalance} PNK</h6>
                        )
                      }
                      failedLoading="..."
                    />
                    <RenderIf
                      resource={balance}
                      loading={<Icosahedron />}
                      done={<h6>{balance.data} ETH</h6>}
                      failedLoading="..."
                    />
                  </div>
                </div>
              }
              failedLoading="There was an error fetching your account."
            />
          </div>
          <div className="Home-stats-block">
            <RenderIf
              resource={PNKBalance}
              loading={<Icosahedron />}
              done={
                PNKBalance.data && (
                  <div className="Home-stats-block-content">
                    <BalancePieChart
                      type="activated"
                      balance={PNKBalance.data.activatedTokens}
                      total={PNKBalance.data.tokenBalance}
                      size={80}
                    />
                    <div className="Home-stats-block-content-header">
                      <h5>
                        Activated<RenderIf
                          resource={arbitratorData}
                          loading={null}
                          done={
                            arbitratorData.data &&
                            PERIOD_ENUM[arbitratorData.data.period] ===
                              'activation' && (
                              <Button
                                onClick={this.handleActivateButtonClick}
                                className="Home-stats-block-content-header-activateButton"
                                labelClassName="Home-stats-block-content-header-activateButton-label"
                              >
                                +
                              </Button>
                            )
                          }
                        />
                      </h5>
                      <h6>{PNKBalance.data.activatedTokens} PNK</h6>
                    </div>
                  </div>
                )
              }
              failedLoading="..."
            />
          </div>
          <div className="Home-stats-block">
            <RenderIf
              resource={PNKBalance}
              loading={<Icosahedron />}
              done={
                PNKBalance.data && (
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
                )
              }
              failedLoading="..."
            />
          </div>
        </div>
        <div className="Home-separatorHeader">
          <h4>Notifications</h4>
        </div>
        <div className="Home-cardList">
          <RenderIf
            resource={notifications}
            loading={<Icosahedron />}
            done={
              notifications.data &&
              notifications.data.map(n => (
                <div key={n._id} className="Home-cardList-card">
                  <NotificationCard
                    id={n._id}
                    message={n.message}
                    to={`/disputes/${n.data.disputeId}`}
                    onDismissClick={this.handleNotificationCardDismissClick}
                  />
                </div>
              ))
            }
            failedLoading="There was an error fetching your notifications..."
          />
        </div>
        <div className="Home-separatorHeader">
          <h4>Pending Actions</h4>
        </div>
        <div className="Home-cardList">
          <RenderIf
            resource={pendingActions}
            loading={<Icosahedron />}
            done={
              pendingActions.data &&
              pendingActions.data.map(p => (
                <div
                  key={p.message + p.data.disputeId}
                  className="Home-cardList-card"
                >
                  <DisputeCard
                    status={0}
                    subcourt="GENERAL COURT"
                    date={new Date()}
                    title={p.message}
                  />
                </div>
              ))
            }
            failedLoading="There was an error fetching your notifications..."
          />
        </div>
      </div>
    )
  }
}

export default connect(
  state => ({
    accounts: state.wallet.accounts,
    balance: state.wallet.balance,
    notifications: notificationSelectors.getNotifications(state),
    pendingActions: state.notification.pendingActions,
    PNKBalance: state.arbitrator.PNKBalance,
    arbitratorData: state.arbitrator.arbitratorData,
    activatePNKFormIsInvalid: getActivatePNKFormIsInvalid(state)
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    fetchNotifications: notificationActions.fetchNotifications,
    fetchPendingActions: notificationActions.fetchPendingActions,
    dismissNotification: notificationActions.dismissNotification,
    fetchPNKBalance: arbitratorActions.fetchPNKBalance,
    activatePNK: arbitratorActions.activatePNK,
    fetchArbitratorData: arbitratorActions.fetchArbitratorData,
    submitActivatePNKForm
  }
)(Home)
