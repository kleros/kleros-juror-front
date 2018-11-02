import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Button from '../../../../components/button'
import { form } from '../../../../utils/form-generator'
import { required, number, positiveNumber } from '../../../../utils/validation'
import { weiBNToDecimalString } from '../../../../utils/number'

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

export {
  getBuyPNKFromBondingCurveFormIsInvalid,
  submitBuyPNKFromBondingCurveForm
}

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

export {
  getSellPNKToBondingCurveFormIsInvalid,
  submitSellPNKToBondingCurveForm
}

class BondingCurveForm extends PureComponent {
  static propTypes = {
    handleBuyPNK: PropTypes.func.isRequired,
    validateBuyPNK: PropTypes.func.isRequired,
    handleSellPNK: PropTypes.func.isRequired,
    validateSellPNK: PropTypes.func.isRequired,
    buyPNKFromBondingCurveFormIsInvalid: PropTypes.bool.isRequired,
    sellPNKToBondingCurveFormIsInvalid: PropTypes.bool.isRequired,
    submitBuyPNKFromBondingCurveForm: PropTypes.func.isRequired,
    submitSellPNKToBondingCurveForm: PropTypes.func.isRequired,
    viewState: PropTypes.shape({
      estimatedETH: PropTypes.string.isRequired,
      estimatedPNK: PropTypes.string.isRequired
    }).isRequired
  }

  onBuyPNKFormChange(values, dispatch, _props) {
    dispatch({
      type: 'ESTIMATE_PNK_FROM_BONDING_CURVE',
      payload: { ETH: values.amountOfETH }
    })
  }

  onSellPNKFormChange(values, dispatch, _props) {
    dispatch({
      type: 'ESTIMATE_ETH_FROM_BONDING_CURVE',
      payload: { PNK: values.amountOfPNK }
    })
  }

  render() {
    const {
      handleBuyPNK,
      validateBuyPNK,
      handleSellPNK,
      validateSellPNK,
      buyPNKFromBondingCurveFormIsInvalid,
      sellPNKToBondingCurveFormIsInvalid,
      submitBuyPNKFromBondingCurveForm,
      submitSellPNKToBondingCurveForm,
      viewState
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
                Estimated amount of PNK you'll get:{' '}
                {weiBNToDecimalString(viewState.estimatedPNK)}
              </span>
            )
          }}
          onSubmit={handleBuyPNK}
          validate={validateBuyPNK}
          onChange={this.onBuyPNKFormChange}
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
                Estimated amount of ETH you'll get:{' '}
                {weiBNToDecimalString(viewState.estimatedETH)}
              </span>
            )
          }}
          onSubmit={handleSellPNK}
          validate={validateSellPNK}
          onChange={this.onSellPNKFormChange}
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

export { BondingCurveForm }
