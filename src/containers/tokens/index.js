import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'
import ReactModal from 'react-modal'

import { ChainData } from '../../chainstrap'
import { ARBITRATOR_ADDRESS, networkID } from '../../bootstrap/dapp-api'
import * as walletSelectors from '../../reducers/wallet'
import * as walletActions from '../../actions/wallet'
import * as arbitratorSelectors from '../../reducers/arbitrator'
import * as arbitratorActions from '../../actions/arbitrator'
import * as bondingCurveSelectors from '../../reducers/bonding-curve'
import * as bondingCurveActions from '../../actions/bonding-curve'
import { camelToTitleCase } from '../../utils/string'
import { weiBNToDecimalString, decimalStringToWeiBN } from '../../utils/number'
import Icosahedron from '../../components/icosahedron'
import Button from '../../components/button'
import * as arbitratorConstants from '../../constants/arbitrator'
import * as chainViewConstants from '../../constants/chain-view'
import * as ethConstants from '../../constants/eth'

import {
  BuyPNKForm,
  getBuyPNKFormIsInvalid,
  submitBuyPNKForm
} from './components/buy-pnk-form'
import {
  PassPeriodForm,
  getPassPeriodFormIsInvalid,
  submitPassPeriodForm
} from './components/pass-period-form'
import {
  TransferPNKForm,
  TransferPNKFormIsInvalid,
  submitTransferPNKForm
} from './components/transfer-pnk-form'
import {
  WithdrawPNKForm,
  WithdrawPNKFormIsInvalid,
  submitWithdrawPNKForm
} from './components/withdraw-pnk-form'
import BondingCurveForm from './components/bonding-curve-form'

import './tokens.css'

class Tokens extends PureComponent {
  static propTypes = {
    // Redux State
    accounts: walletSelectors.accountsShape.isRequired,
    balance: walletSelectors.balanceShape.isRequired,
    PNKBalance: arbitratorSelectors.PNKBalanceShape.isRequired,
    arbitratorData: arbitratorSelectors.arbitratorDataShape.isRequired,
    bondingCurveTotals:
      bondingCurveSelectors.bondingCurveTotalsShape.isRequired,

    // Action Dispatchers
    fetchBalance: PropTypes.func.isRequired,
    fetchPNKBalance: PropTypes.func.isRequired,
    buyPNK: PropTypes.func.isRequired,
    fetchArbitratorData: PropTypes.func.isRequired,
    passPeriod: PropTypes.func.isRequired,
    transferPNK: PropTypes.func.isRequired,
    withdrawPNK: PropTypes.func.isRequired,
    buyPNKFromBondingCurve: PropTypes.func.isRequired,
    sellPNKToBondingCurve: PropTypes.func.isRequired,
    fetchBondingCurveData: PropTypes.func.isRequired,

    // Transfer PNK
    transferPNKFormIsInvalid: PropTypes.bool.isRequired,
    submitTransferPNKForm: PropTypes.func.isRequired,

    // Withdraw PNK
    withdrawPNKFormIsInvalid: PropTypes.bool.isRequired,
    submitWithdrawPNKForm: PropTypes.func.isRequired,

    // buyPNKForm
    buyPNKFormIsInvalid: PropTypes.bool.isRequired,
    submitBuyPNKForm: PropTypes.func.isRequired,

    // passPeriodForm
    passPeriodFormIsInvalid: PropTypes.bool.isRequired,
    submitPassPeriodForm: PropTypes.func.isRequired
  }

  state = {
    showBondingCurveForm: false
  }

  componentDidMount() {
    const {
      fetchBalance,
      fetchPNKBalance,
      fetchArbitratorData,
      fetchBondingCurveData
    } = this.props
    fetchBalance()
    fetchPNKBalance()
    fetchArbitratorData()
    fetchBondingCurveData()
  }

  validateTransferPNKForm = values => {
    const { PNKBalance } = this.props
    const errors = {}
    if (
      PNKBalance.data.contractBalance.lessThan(
        decimalStringToWeiBN(values.amount)
      )
    )
      errors.amount = 'You do not own this much PNK.'
    return errors
  }

  validateWithdrawPNKForm = values => {
    const { PNKBalance } = this.props
    const errors = {}
    if (
      PNKBalance.data.tokenBalance
        .minus(PNKBalance.data.lockedTokens)
        .lessThan(decimalStringToWeiBN(values.amount))
    )
      errors.amount = 'You do not have this much free PNK.'
    return errors
  }

  handleWithdrawPNKFormSubmit = formData => {
    const { withdrawPNK } = this.props
    const { amount } = formData
    withdrawPNK(decimalStringToWeiBN(amount).toString())
  }

  handleTransferPNKFormSubmit = formData => {
    const { transferPNK } = this.props
    const { amount } = formData
    transferPNK(decimalStringToWeiBN(amount).toString())
  }

  handleBuyPNKFormSubmit = formData => {
    const { buyPNK } = this.props
    const { amount } = formData
    buyPNK(decimalStringToWeiBN(amount).toString())
  }

  handleBuyPNKFromBondingCurveForm = formData => {
    const { buyPNKFromBondingCurve } = this.props
    const { amountOfETH } = formData
    buyPNKFromBondingCurve(decimalStringToWeiBN(amountOfETH).toString())
  }

  handleSellPNKToBondingCurveForm = formData => {
    const { sellPNKToBondingCurve } = this.props
    const { amountOfPNK } = formData
    sellPNKToBondingCurve(decimalStringToWeiBN(amountOfPNK).toString())
  }

  handleToggleBondingCurveForm = event => {
    const { showBondingCurveForm } = this.state
    this.setState({ showBondingCurveForm: showBondingCurveForm })
    event.preventDefault()
  }

  render() {
    const {
      accounts,
      balance,
      PNKBalance,
      arbitratorData,
      passPeriod,
      buyPNKFormIsInvalid,
      submitBuyPNKForm,
      passPeriodFormIsInvalid,
      submitPassPeriodForm,
      transferPNKFormIsInvalid,
      submitTransferPNKForm,
      withdrawPNKFormIsInvalid,
      submitWithdrawPNKForm,
      bondingCurveTotals
    } = this.props

    const { showBondingCurveForm } = this.state

    if (!PNKBalance.data || !arbitratorData.data) return null

    let withdrawInvalid = true
    if (
      !withdrawPNKFormIsInvalid &&
      PNKBalance.data.activatedTokens.toNumber() === 0
    ) {
      withdrawInvalid = false
    }

    const forms = [
      <div key={0}>
        <ReactModal ariaHideApp={false} isOpen={showBondingCurveForm}>
          <div
            onClick={this.handleToggleBondingCurveForm}
            className="Tokens-modal-dismiss"
          >
            &times;
          </div>
          <RenderIf
            resource={bondingCurveTotals}
            loading={<Icosahedron />}
            done={
              <BondingCurveForm
                handleBuyPNK={this.handleBuyPNKFromBondingCurveForm}
                handleSellPNK={this.handleSellPNKToBondingCurveForm}
                bondingCurveTotals={bondingCurveTotals}
              />
            }
          />
        </ReactModal>
        <TransferPNKForm
          enableReinitialize
          keepDirtyOnReinitialize
          initialValues={{
            explaination: (
              <span>
                In order to deposit PNK in a session you must transfer PNK to
                the Kleros contract. You may withdraw your tokens at any time as
                long as you have not deposited PNK in the current session.
                <br />
                <br />
                <small>
                  If you don't have PNK, you can buy some from{' '}
                  <a onClick={this.handleToggleBondingCurveForm}>here</a> or
                  from{' '}
                  <a
                    href="https://idex.market/eth/pnk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    IDEX
                  </a>
                  .
                </small>
              </span>
            ),
            amount: weiBNToDecimalString(PNKBalance.data.contractBalance)
          }}
          onSubmit={this.handleTransferPNKFormSubmit}
          validate={this.validateTransferPNKForm}
        />

        <Button
          onClick={submitTransferPNKForm}
          size="small"
          disabled={transferPNKFormIsInvalid}
          className="Tokens-form-button"
        >
          TRANSFER PNK
        </Button>
        <WithdrawPNKForm
          enableReinitialize
          keepDirtyOnReinitialize
          initialValues={{
            explaination: (
              <span>
                Withdraw PNK from the Kleros contract. You may only call this
                during a session that you have not deposited tokens in. You can
                not withdraw tokens that are at stake in active disputes.
              </span>
            ),
            amount: weiBNToDecimalString(
              PNKBalance.data.tokenBalance.minus(PNKBalance.data.lockedTokens)
            )
          }}
          onSubmit={this.handleWithdrawPNKFormSubmit}
          validate={this.validateWithdrawPNKForm}
        />

        <Button
          onClick={submitWithdrawPNKForm}
          size="small"
          disabled={withdrawInvalid}
          className="Tokens-form-button"
        >
          WITHDRAW PNK
        </Button>
      </div>
    ]

    if (Number(networkID) !== ethConstants.MAINNET) {
      forms.push(
        <div key={1}>
          <BuyPNKForm
            enableReinitialize
            keepDirtyOnReinitialize
            initialValues={{
              rate: (
                <span>
                  <b>Rate:</b> 1 ETH = 1 PNK
                </span>
              )
            }}
            onSubmit={this.handleBuyPNKFormSubmit}
          />

          <Button
            onClick={submitBuyPNKForm}
            disabled={buyPNKFormIsInvalid}
            className="Tokens-form-button"
          >
            <ChainData
              contractName={chainViewConstants.KLEROS_POC_NAME}
              contractAddress={ARBITRATOR_ADDRESS}
              functionSignature={chainViewConstants.KLEROS_POC_BUY_PINAKION_SIG}
              parameters={chainViewConstants.KLEROS_POC_BUY_PINAKION_PARAMS()}
              estimatedGas={chainViewConstants.KLEROS_POC_BUY_PINAKION_GAS}
            >
              BUY NOW
            </ChainData>
          </Button>
          <PassPeriodForm
            enableReinitialize
            keepDirtyOnReinitialize
            onSubmit={passPeriod}
          />

          <Button
            onClick={submitPassPeriodForm}
            disabled={passPeriodFormIsInvalid}
            className="Tokens-form-button Tokens-form-button--nextPeriod"
          >
            <ChainData
              contractName={chainViewConstants.KLEROS_POC_NAME}
              contractAddress={ARBITRATOR_ADDRESS}
              functionSignature={chainViewConstants.KLEROS_POC_PASS_PERIOD_SIG}
              parameters={chainViewConstants.KLEROS_POC_PASS_PERIOD_PARAMS()}
              estimatedGas={chainViewConstants.KLEROS_POC_PASS_PERIOD_GAS}
            >
              NEXT PERIOD
            </ChainData>
          </Button>
        </div>
      )
    }

    return (
      <div className="Tokens">
        <div className="Tokens-info">
          <div className="Tokens-info-item">
            <b>ETH Balance:</b>{' '}
            <ChainData
              contractName={chainViewConstants.WALLET_NAME}
              contractAddress={accounts.data[0]}
            >
              {balance.data}
            </ChainData>
          </div>
          <div className="Tokens-info-item">
            <b>PNK Balance:</b>{' '}
            <ChainData
              contractName={chainViewConstants.KLEROS_POC_NAME}
              contractAddress={ARBITRATOR_ADDRESS}
              functionSignature={chainViewConstants.KLEROS_POC_JURORS_SIG}
              parameters={chainViewConstants.KLEROS_POC_JURORS_PARAMS(
                accounts.data[0]
              )}
            >
              {weiBNToDecimalString(PNKBalance.data.tokenBalance)}
            </ChainData>
          </div>
          <div className="Tokens-info-item">
            <b>Activated PNK:</b>{' '}
            {weiBNToDecimalString(PNKBalance.data.activatedTokens)}
          </div>
          <div className="Tokens-info-item">
            <b>Locked PNK:</b>{' '}
            {weiBNToDecimalString(PNKBalance.data.lockedTokens)}
          </div>
          <div className="Tokens-info-item">
            <b>Session:</b>
            {` ${arbitratorData.data.session}`}
          </div>
          <div className="Tokens-info-item">
            <b>Period:</b>
            {` ${camelToTitleCase(
              arbitratorConstants.PERIOD_ENUM[arbitratorData.data.period]
            )} - ${
              arbitratorConstants.PERIOD_DESCRIPTION_ENUM[
                arbitratorData.data.period
              ]
            }`}
          </div>
        </div>
        <div className="Tokens-form">
          <RenderIf
            resource={balance}
            loading={<Icosahedron />}
            done={
              balance.data && (
                <RenderIf
                  resource={PNKBalance}
                  loading={<Icosahedron />}
                  done={forms}
                  failedLoading="There was an error fetching your PNK balance."
                />
              )
            }
            failedLoading="There was an error fetching your ETH balance."
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
    PNKBalance: state.arbitrator.PNKBalance,
    arbitratorData: state.arbitrator.arbitratorData,
    bondingCurveTotals: state.bondingCurve.bondingCurveTotals,
    buyPNKFormIsInvalid: getBuyPNKFormIsInvalid(state),
    passPeriodFormIsInvalid: getPassPeriodFormIsInvalid(state),
    transferPNKFormIsInvalid: TransferPNKFormIsInvalid(state),
    withdrawPNKFormIsInvalid: WithdrawPNKFormIsInvalid(state)
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    fetchPNKBalance: arbitratorActions.fetchPNKBalance,
    buyPNK: arbitratorActions.buyPNK,
    fetchArbitratorData: arbitratorActions.fetchArbitratorData,
    passPeriod: arbitratorActions.passPeriod,
    transferPNK: arbitratorActions.transferPNK,
    withdrawPNK: arbitratorActions.withdrawPNK,
    buyPNKFromBondingCurve: bondingCurveActions.buyPNKFromBondingCurve,
    sellPNKToBondingCurve: bondingCurveActions.sellPNKToBondingCurve,
    fetchBondingCurveData: bondingCurveActions.fetchBondingCurveData,
    submitBuyPNKForm,
    submitPassPeriodForm,
    submitTransferPNKForm,
    submitWithdrawPNKForm
  }
)(Tokens)
