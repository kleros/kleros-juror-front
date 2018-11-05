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
    handleBuyPNK: PropTypes.func.isRequired,
    handleSellPNK: PropTypes.func.isRequired,
    buyPNKFromBondingCurveFormIsInvalid: PropTypes.bool.isRequired,
    sellPNKToBondingCurveFormIsInvalid: PropTypes.bool.isRequired,
    submitBuyPNKFromBondingCurveForm: PropTypes.func.isRequired,
    submitSellPNKToBondingCurveForm: PropTypes.func.isRequired,
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
        bondingCurveTotals.data.totalPNK,
        bondingCurveTotals.data.spread
      )
    )
  }

  estimateETH() {
    const { inputPNK, bondingCurveTotals } = this.props
    return weiBNToDecimalString(
      estimateETH(
        inputPNK,
        bondingCurveTotals.data.totalETH,
        bondingCurveTotals.data.totalPNK,
        bondingCurveTotals.data.spread
      )
    )
  }

  render() {
    const {
      handleBuyPNK,
      handleSellPNK,
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
              <span>
                Estimated amount of PNK you'll get: {this.estimatePNK()}
              </span>
            )
          }}
          onSubmit={handleBuyPNK}
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
              <span>
                Estimated amount of ETH you'll get: {this.estimateETH()}
              </span>
            )
          }}
          onSubmit={handleSellPNK}
        />
        <Button
          onClick={submitSellPNKToBondingCurveForm}
          disabled={sellPNKToBondingCurveFormIsInvalid}
          className="Tokens-form-button"
        >
          SELL NOW
        </Button>
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
    submitBuyPNKFromBondingCurveForm
  }
)(BondingCurveForm)

const SPREAD_DIVISOR = toBN(10000) // Must be kept in sync with the bonding curve contract

/** Given an input ETH amount and the state values of the bonding curve contract,
 *  compute the amount of PNK that can be brought using the same formula as the
 *  bonding curve contract. Note this duplicates the algorithm from the contract
 *  but we can't call the contract because that way the turnaround would be too
 *  slow for a responsive UI.
 *  @param {string} inputETH User input ETH amount in ETH (not Wei). May not be a valid number.
 *  @param {BigNumber} totalETH 'totalETH' value of the contract.
 *  @param {BigNumber} totalPNK 'totalPNK' value of the contract.
 *  @param {BigNumber} spread 'spread' value of the contract.
 *  @returns {string} Amount of PNK in wei.
 */
function estimatePNK(inputETH, totalETH, totalPNK, spread) {
  var ETH
  try {
    ETH = decimalStringToWeiBN(inputETH)
  } catch (_) {
    return '0'
  }
  // convert all to BN from BigNumber
  totalETH = toBN(totalETH)
  totalPNK = toBN(totalPNK)
  spread = toBN(spread)

  return ETH.mul(totalPNK)
    .mul(SPREAD_DIVISOR)
    .div(totalETH.add(ETH))
    .div(SPREAD_DIVISOR.add(spread))
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
 *  @param {BigNumber} spread 'spread' value of the contract.
 *  @returns {string} Amount of ETH in wei.
 */
function estimateETH(inputPNK, totalETH, totalPNK, spread) {
  var PNK
  try {
    PNK = decimalStringToWeiBN(inputPNK)
  } catch (_) {
    return '0'
  }
  // convert all to BN from BigNumber
  totalETH = toBN(totalETH)
  totalPNK = toBN(totalPNK)
  spread = toBN(spread)

  return totalETH
    .mul(PNK)
    .mul(SPREAD_DIVISOR)
    .div(totalPNK.add(PNK))
    .div(SPREAD_DIVISOR.add(spread))
    .toString()
}
