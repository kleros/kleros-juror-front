import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { formValueSelector } from 'redux-form'

import Button from '../../../../components/button'
import { form } from '../../../../utils/form-generator'
import { required, number, positiveNumber } from '../../../../utils/validation'
import {
  decimalStringToWeiBN,
  weiBNToDecimalString,
  roundToFixedDecimals,
  fractionToDecimal
} from '../../../../utils/number'
import * as bondingCurveSelectors from '../../../../reducers/bonding-curve'
import * as bondingCurveActions from '../../../../actions/bonding-curve'
import { networkID } from '../../../../bootstrap/dapp-api'
import * as ethConstants from '../../../../constants/eth'

import { estimatePNK, estimateETH } from './utils'

const {
  Form: BuyPNKFromBondingCurveForm,
  isInvalid: getBuyPNKFromBondingCurveFormIsInvalid,
  submit: submitBuyPNKFromBondingCurveForm
} = form('buyPNKFromBondingCurveForm', {
  header: {
    type: 'header',
    props: { title: 'BUY PNK' }
  },
  amountOfETH: {
    type: 'text',
    validate: [required, number, positiveNumber],
    props: {
      type: 'number',
      className: 'Form-noMargins'
    }
  },
  rate: {
    type: 'info',
    props: {
      className: 'Tokens-form-rate'
    }
  }
})

const { Form: SellPNKToBondingCurveFormHeader } = form(
  'sellPNKToBondingCurveFormHeader',
  {
    header: {
      type: 'header',
      props: { title: 'SELL PNK' }
    }
  }
)

const {
  Form: SellPNKToBondingCurveForm,
  isInvalid: getSellPNKToBondingCurveFormIsInvalid,
  submit: submitSellPNKToBondingCurveForm
} = form('sellPNKToBondingCurveForm', {
  amountOfPNK: {
    type: 'text',
    validate: [required, number, positiveNumber],
    props: {
      type: 'number',
      className: 'Form-noMargins'
    }
  },
  rate: {
    type: 'info',
    props: {
      className: 'Tokens-form-rate'
    }
  }
})

// Normally it's reasonable to use integer to represent the amount of PNK. But
// on Kovan because the exchange has so few PNKs in it we have to show 4 decimal
// places otherwise the value is just 0.
const PNK_DECIMALS = Number(networkID) === ethConstants.MAINNET ? 0 : 4

class BondingCurveForm extends PureComponent {
  static propTypes = {
    buyPNKFromBondingCurveFormIsInvalid: PropTypes.bool.isRequired,
    sellPNKToBondingCurveFormIsInvalid: PropTypes.bool.isRequired,
    submitBuyPNKFromBondingCurveForm: PropTypes.func.isRequired,
    submitSellPNKToBondingCurveForm: PropTypes.func.isRequired,
    buyPNKFromBondingCurve: PropTypes.func.isRequired,
    sellPNKToBondingCurve: PropTypes.func.isRequired,
    approvePNKToBondingCurve: PropTypes.func.isRequired,
    bondingCurveTotals:
      bondingCurveSelectors.bondingCurveTotalsShape.isRequired,
    inputETH: PropTypes.string,
    inputPNK: PropTypes.string,
    approveTransactionProgress: PropTypes.string.isRequired
  }

  static defaultProps = { inputETH: '0', inputPNK: '0' }

  estimatePNK() {
    const { inputETH, bondingCurveTotals } = this.props
    const PNK = weiBNToDecimalString(
      estimatePNK(
        inputETH,
        bondingCurveTotals.data.totalETH,
        bondingCurveTotals.data.totalPNK
      )
    )
    if (PNK === '0') return '0'
    else return roundToFixedDecimals(PNK, PNK_DECIMALS)
  }

  buyPrice() {
    const { inputETH, bondingCurveTotals } = this.props
    const PNK = estimatePNK(
      inputETH,
      bondingCurveTotals.data.totalETH,
      bondingCurveTotals.data.totalPNK
    )
    if (PNK === '0')
      return roundToFixedDecimals(
        fractionToDecimal(
          bondingCurveTotals.data.totalPNK,
          bondingCurveTotals.data.totalETH
        ),
        PNK_DECIMALS
      )
    else
      return roundToFixedDecimals(
        fractionToDecimal(PNK, decimalStringToWeiBN(inputETH).toString()),
        PNK_DECIMALS
      )
  }

  estimateETH() {
    const { inputPNK, bondingCurveTotals } = this.props
    const ETH = weiBNToDecimalString(
      estimateETH(
        inputPNK,
        bondingCurveTotals.data.totalETH,
        bondingCurveTotals.data.totalPNK
      )
    )
    if (ETH === '0') return '0'
    else return roundToFixedDecimals(ETH, 4)
  }

  sellPrice() {
    const { inputPNK, bondingCurveTotals } = this.props
    const ETH = estimateETH(
      inputPNK,
      bondingCurveTotals.data.totalETH,
      bondingCurveTotals.data.totalPNK
    )
    if (ETH === '0')
      return roundToFixedDecimals(
        fractionToDecimal(
          bondingCurveTotals.data.totalPNK,
          bondingCurveTotals.data.totalETH
        ),
        PNK_DECIMALS
      )
    else
      return roundToFixedDecimals(
        fractionToDecimal(decimalStringToWeiBN(inputPNK).toString(), ETH),
        PNK_DECIMALS
      )
  }

  unlock = event => {
    const { approvePNKToBondingCurve } = this.props
    const APPROVE_PNK_AMOUNT = '100000000'

    approvePNKToBondingCurve(
      decimalStringToWeiBN(APPROVE_PNK_AMOUNT).toString()
    )
    event.preventDefault()
  }

  isApproveRequired() {
    const {
      inputPNK,
      bondingCurveTotals,
      approveTransactionProgress
    } = this.props
    if (approveTransactionProgress === 'done') return false

    const allowance = bondingCurveTotals.data.allowance
    return (
      allowance.isZero() || allowance.lt(decimalStringToWeiBN(inputPNK || '0'))
    )
  }

  isSellButtonEnabled() {
    const { sellPNKToBondingCurveFormIsInvalid } = this.props
    return !sellPNKToBondingCurveFormIsInvalid && !this.isApproveRequired()
  }

  handleBuyPNK = formData => {
    const { buyPNKFromBondingCurve } = this.props
    const { amountOfETH } = formData
    buyPNKFromBondingCurve(decimalStringToWeiBN(amountOfETH).toString())
  }

  handleSellPNK = formData => {
    const { sellPNKToBondingCurve } = this.props
    const { amountOfPNK } = formData
    sellPNKToBondingCurve(decimalStringToWeiBN(amountOfPNK).toString())
  }

  render() {
    const {
      buyPNKFromBondingCurveFormIsInvalid,
      submitBuyPNKFromBondingCurveForm,
      submitSellPNKToBondingCurveForm,
      approveTransactionProgress
    } = this.props

    return (
      <div>
        <BuyPNKFromBondingCurveForm
          enableReinitialize
          keepDirtyOnReinitialize
          initialValues={{
            rate: (
              <div>
                <small>
                  Estimated amount of PNK you'll get: {this.estimatePNK()}
                </small>
                <br />
                <small>Exchange rate: 1 ETH = {this.buyPrice()} PNK</small>
              </div>
            )
          }}
          onSubmit={this.handleBuyPNK}
        />
        <Button
          onClick={submitBuyPNKFromBondingCurveForm}
          size="small"
          disabled={buyPNKFromBondingCurveFormIsInvalid}
          className="Tokens-form-button"
        >
          BUY
        </Button>

        <SellPNKToBondingCurveFormHeader />
        <div className="Tokens-sell-form">
          <div>
            <SellPNKToBondingCurveForm
              enableReinitialize
              keepDirtyOnReinitialize
              initialValues={{
                rate: (
                  <div>
                    <small>
                      Estimated amount of ETH you'll get: {this.estimateETH()}
                    </small>
                    <br />
                    <small>Exchange rate: 1 ETH = {this.sellPrice()} PNK</small>
                  </div>
                )
              }}
              onSubmit={this.handleSellPNK}
              disabled={this.isApproveRequired()}
            />
          </div>
          <div className="Tokens-sell-unlock">
            {approveTransactionProgress ===
            'done' ? null : !this.isApproveRequired() ? null : approveTransactionProgress ===
              'pending' ? (
              <span>Unlocking...</span>
            ) : approveTransactionProgress === 'confirming' ? (
              <span>Confirming...</span>
            ) : (
              <Button onClick={this.unlock} className="Tokens-unlock-button">
                UNLOCK
              </Button>
            )}
          </div>
        </div>
        <Button
          onClick={submitSellPNKToBondingCurveForm}
          size="small"
          disabled={!this.isSellButtonEnabled()}
          className="Tokens-form-button"
        >
          SELL
        </Button>

        <div>
          <small className="Tokens-form-footer">
            Exchange is powered by{' '}
            <a
              href="https://uniswap.exchange"
              target="_blank"
              rel="noopener noreferrer"
            >
              UniSwap
            </a>
            .
          </small>
        </div>
      </div>
    )
  } // render()
}

export default connect(
  state => ({
    inputETH: formValueSelector('buyPNKFromBondingCurveForm')(
      state,
      'amountOfETH'
    ),
    inputPNK: formValueSelector('sellPNKToBondingCurveForm')(
      state,
      'amountOfPNK'
    ),
    buyPNKFromBondingCurveFormIsInvalid: getBuyPNKFromBondingCurveFormIsInvalid(
      state
    ),
    sellPNKToBondingCurveFormIsInvalid: getSellPNKToBondingCurveFormIsInvalid(
      state
    ),
    approveTransactionProgress:
      state.bondingCurve.approveTransactionProgress.data
  }),
  {
    getSellPNKToBondingCurveFormIsInvalid,
    submitSellPNKToBondingCurveForm,
    getBuyPNKFromBondingCurveFormIsInvalid,
    submitBuyPNKFromBondingCurveForm,
    buyPNKFromBondingCurve: bondingCurveActions.buyPNKFromBondingCurve,
    sellPNKToBondingCurve: bondingCurveActions.sellPNKToBondingCurve,
    approvePNKToBondingCurve: bondingCurveActions.approvePNKToBondingCurve
  }
)(BondingCurveForm)
