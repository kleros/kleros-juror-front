import { connect } from 'react-redux'
import { toBN } from 'ethjs'
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { formValueSelector } from 'redux-form'

import Button from '../../../../components/button'
import { form } from '../../../../utils/form-generator'
import { required, number, positiveNumber } from '../../../../utils/validation'
import {
  decimalStringToWeiBN,
  weiBNToDecimalString
} from '../../../../utils/number'
import * as bondingCurveSelectors from '../../../../reducers/bonding-curve'
import * as bondingCurveActions from '../../../../actions/bonding-curve'

const {
  Form: BuyPNKFromBondingCurveForm,
  isInvalid: getBuyPNKFromBondingCurveFormIsInvalid,
  submit: submitBuyPNKFromBondingCurveForm
} = form('buyPNKFromBondingCurveForm', {
  header: {
    type: 'header',
    props: { title: 'BUY PNK' }
  },
  explanation: {
    type: 'info'
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

const {
  Form: SellPNKToBondingCurveForm,
  isInvalid: getSellPNKToBondingCurveFormIsInvalid,
  submit: submitSellPNKToBondingCurveForm
} = form('sellPNKToBondingCurveForm', {
  header: {
    type: 'header',
    props: { title: 'SELL PNK' }
  },
  explanation: {
    type: 'info'
  },
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

/**
 * Convert a fraction to float.
 * @param {BigNumber} numerator - The numerator.
 * @param {BigNumber} denominator - The denominator.
 * @returns {number} - The result.
 */
function toFloat(numerator, denominator) {
  return (
    numerator
      .mul(toBN(10000))
      .div(denominator)
      .toNumber() / 10000
  )
}

/**
 * Round number to 4 significant figures.
 * @param {string} n - Input number.
 * @returns {string} - Rounded number with at least 4 significant figures.
 */
function round(n) {
  // Pad the number so it has at least 4 significant figures.
  if (n.indexOf('.') === -1) {
    n += '.'
  }
  n += '0000'

  var count = 0
  var dot = false
  for (var i = 0; i < n.length; i++) {
    if (n[i] === '.') {
      dot = true
    } else if (n[i] !== '0' || count > 0) {
      // Past leading zeros.
      count += 1
    }
    if (count >= 4 && dot) {
      break
    }
  }
  // Remove trailing dot.
  if (n[i] === '.') {
    i -= 1
  }
  return n.slice(0, i + 1)
}

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
    if (PNK === '0') {
      return '0'
    } else {
      return round(PNK)
    }
  }

  buyPrice() {
    const { inputETH, bondingCurveTotals } = this.props
    const PNK = estimatePNK(
      inputETH,
      bondingCurveTotals.data.totalETH,
      bondingCurveTotals.data.totalPNK
    )
    if (PNK === '0') {
      return round(
        toFloat(
          bondingCurveTotals.data.totalPNK,
          bondingCurveTotals.data.totalETH
        ).toString()
      )
    } else {
      return round(
        toFloat(toBN(PNK), decimalStringToWeiBN(inputETH)).toString()
      )
    }
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
    if (ETH === '0') {
      return '0'
    } else {
      return round(ETH)
    }
  }

  sellPrice() {
    const { inputPNK, bondingCurveTotals } = this.props
    const ETH = estimateETH(
      inputPNK,
      bondingCurveTotals.data.totalETH,
      bondingCurveTotals.data.totalPNK
    )
    if (ETH === '0') {
      return round(
        toFloat(
          bondingCurveTotals.data.totalPNK,
          bondingCurveTotals.data.totalETH
        ).toString()
      )
    } else {
      return round(
        toFloat(decimalStringToWeiBN(inputPNK), toBN(ETH)).toString()
      )
    }
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
    if (approveTransactionProgress === 'done') {
      return false
    }

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
            explanation: <span>The amount of ETH you'd like to spend:</span>,
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
          disabled={buyPNKFromBondingCurveFormIsInvalid}
          className="Tokens-form-button"
        >
          BUY
        </Button>

        <SellPNKToBondingCurveForm
          enableReinitialize
          keepDirtyOnReinitialize
          initialValues={{
            explanation: <span>The amount of PNK you'd like to sell:</span>,
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
        />

        {approveTransactionProgress === 'done' ? (
          <div>
            <div className="Tokens-form-text">
              <span>Tokens have been unlocked.</span>
            </div>
            <Button
              onClick={submitSellPNKToBondingCurveForm}
              disabled={!this.isSellButtonEnabled()}
              className="Tokens-form-button"
            >
              SELL
            </Button>
          </div>
        ) : !this.isApproveRequired() ? (
          <Button
            onClick={submitSellPNKToBondingCurveForm}
            disabled={!this.isSellButtonEnabled()}
            className="Tokens-form-button"
          >
            SELL
          </Button>
        ) : approveTransactionProgress === 'pending' ? (
          <div className="Tokens-form-text">
            <span>Unlocking...</span>
          </div>
        ) : approveTransactionProgress === 'confirming' ? (
          <div className="Tokens-form-text">
            <span>Waiting for confirmation...</span>
          </div>
        ) : (
          <div>
            <div className="Tokens-form-text">
              <span>Please unlock tokens first:</span>
            </div>
            <Button onClick={this.unlock} className="Tokens-form-button">
              UNLOCK
            </Button>
          </div>
        )}

        <div>
          <small className="Tokens-form-footer">
            Powered by{' '}
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

const SPREAD_FACTOR = toBN(997)
const SPREAD_DIVISOR = toBN(1000)

/** Given an input ETH amount and the state values of the bonding curve contract,
 *  compute the amount of PNK that can be brought using the same formula as the
 *  bonding curve contract. Note this duplicates the algorithm from the contract
 *  but we can't call the contract because that way the turnaround would be too
 *  slow for a responsive UI.
 *  @param {string} inputETH User input ETH amount in ETH (not Wei). May not be a valid number.
 *  @param {BigNumber} totalETH 'totalETH' value of the contract.
 *  @param {BigNumber} totalPNK 'totalPNK' value of the contract.
 *  @returns {string} Amount of PNK in wei.
 */
function estimatePNK(inputETH, totalETH, totalPNK) {
  try {
    inputETH = decimalStringToWeiBN(inputETH)
  } catch (_) {
    return '0'
  }
  // convert all to BN from BigNumber
  totalETH = toBN(totalETH)
  totalPNK = toBN(totalPNK)

  return inputETH
    .mul(totalPNK)
    .mul(SPREAD_FACTOR)
    .div(totalETH.mul(SPREAD_DIVISOR).add(inputETH.mul(SPREAD_FACTOR)))
    .toString()
}

/** Given an input PNK amount and the state values of the bonding curve contract,
 *  compute the amount of ETH that the PNK is sold for using the same formula as
 *  the bonding curve contract. Note this duplicates the algorithm from the contract
 *  but we can't call the contract because that way the turnaround would be too
 *  slow for a responsive UI.
 *  @param {string} inputPNK User input PNK amount. May not be a valid number.
 *  @param {BigNumber} totalETH 'totalETH' value of the contract.
 *  @param {BigNumber} totalPNK 'totalPNK' value of the contract.
 *  @returns {string} Amount of ETH in wei.
 */
function estimateETH(inputPNK, totalETH, totalPNK) {
  try {
    inputPNK = decimalStringToWeiBN(inputPNK)
  } catch (_) {
    return '0'
  }
  // convert all to BN from BigNumber
  totalETH = toBN(totalETH)
  totalPNK = toBN(totalPNK)

  return inputPNK
    .mul(totalETH)
    .mul(SPREAD_FACTOR)
    .div(totalPNK.mul(SPREAD_DIVISOR).add(inputPNK.mul(SPREAD_FACTOR)))
    .toString()
}
