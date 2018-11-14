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

class BondingCurveForm extends PureComponent {
  static propTypes = {
    buyPNKFromBondingCurveFormIsInvalid: PropTypes.bool.isRequired,
    sellPNKToBondingCurveFormIsInvalid: PropTypes.bool.isRequired,
    submitBuyPNKFromBondingCurveForm: PropTypes.func.isRequired,
    submitSellPNKToBondingCurveForm: PropTypes.func.isRequired,
    buyPNKFromBondingCurve: PropTypes.func.isRequired,
    sellPNKToBondingCurve: PropTypes.func.isRequired,
    bondingCurveTotals:
      bondingCurveSelectors.bondingCurveTotalsShape.isRequired,
    inputETH: PropTypes.string,
    inputPNK: PropTypes.string
  }

  static defaultProps = { inputETH: '0', inputPNK: '0' }

  estimatePNK() {
    const { inputETH, bondingCurveTotals } = this.props
    return weiBNToDecimalString(
      estimatePNK(
        inputETH,
        bondingCurveTotals.data.totalETH,
        bondingCurveTotals.data.totalPNK
      )
    )
  }

  buyPrice() {
    const { inputETH, bondingCurveTotals } = this.props
    const PNK = estimatePNK(
      inputETH,
      bondingCurveTotals.data.totalETH,
      bondingCurveTotals.data.totalPNK
    )
    if (PNK === '0') {
      return '?'
    } else {
      return toBN(PNK)
        .div(decimalStringToWeiBN(inputETH))
        .toString()
    }
  }

  estimateETH() {
    const { inputPNK, bondingCurveTotals } = this.props
    return weiBNToDecimalString(
      estimateETH(
        inputPNK,
        bondingCurveTotals.data.totalETH,
        bondingCurveTotals.data.totalPNK
      )
    )
  }

  sellPrice() {
    const { inputPNK, bondingCurveTotals } = this.props
    const ETH = estimateETH(
      inputPNK,
      bondingCurveTotals.data.totalETH,
      bondingCurveTotals.data.totalPNK
    )
    if (ETH === '0') {
      return '?'
    } else {
      return decimalStringToWeiBN(inputPNK)
        .div(toBN(ETH))
        .toString()
    }
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
      sellPNKToBondingCurveFormIsInvalid,
      submitBuyPNKFromBondingCurveForm,
      submitSellPNKToBondingCurveForm
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
                <span>
                  Estimated amount of PNK you'll get: {this.estimatePNK()}
                </span>
                <br />
                <span>Exchange rate: 1 ETH = {this.buyPrice()} PNK</span>
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
          BUY NOW
        </Button>

        <SellPNKToBondingCurveForm
          enableReinitialize
          keepDirtyOnReinitialize
          initialValues={{
            explanation: <span>The amount of PNK you'd like to sell:</span>,
            rate: (
              <div>
                <span>
                  Estimated amount of ETH you'll get: {this.estimateETH()}
                </span>
                <br />
                <span>Exchange rate: 1 ETH = {this.sellPrice()} PNK</span>
              </div>
            )
          }}
          onSubmit={this.handleSellPNK}
        />
        <Button
          onClick={submitSellPNKToBondingCurveForm}
          disabled={sellPNKToBondingCurveFormIsInvalid}
          className="Tokens-form-button"
        >
          SELL NOW
        </Button>
        <div className="Tokens-notes">
          <small>You will be requested to sign two transactions.</small>
        </div>
        <div className="Tokens-modal-footer">
          <small>
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
    )
  }),
  {
    getSellPNKToBondingCurveFormIsInvalid,
    submitSellPNKToBondingCurveForm,
    getBuyPNKFromBondingCurveFormIsInvalid,
    submitBuyPNKFromBondingCurveForm,
    buyPNKFromBondingCurve: bondingCurveActions.buyPNKFromBondingCurve,
    sellPNKToBondingCurve: bondingCurveActions.sellPNKToBondingCurve
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
