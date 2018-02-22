import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as arbitratorSelectors from '../../reducers/arbitrator'
import * as arbitratorActions from '../../actions/arbitrator'
import { renderIf } from '../../utils/redux'
import { camelToTitleCase } from '../../utils/string'
import Icosahedron from '../../components/icosahedron'
import Button from '../../components/button'
import { PERIOD_ENUM } from '../../constants/arbitrator'

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

import './testing-panel.css'

class TestingPanel extends PureComponent {
  componentDidMount() {
    const { fetchPNKBalance, fetchArbitratorData } = this.props
    fetchPNKBalance()
    fetchArbitratorData()
  }

  render() {
    const {
      PNKBalance,
      arbitratorData,
      buyPNK,
      passPeriod,
      buyPNKFormIsInvalid,
      submitBuyPNKForm,
      passPeriodFormIsInvalid,
      submitPassPeriodForm
    } = this.props

    return (
      <div className="TestingPanel">
        <div className="TestingPanel-form">
          {renderIf(PNKBalance, {
            loading: <Icosahedron />,
            done: PNKBalance.data && (
              <div>
                <BuyPNKForm
                  enableReinitialize
                  initialValues={{
                    rate: `Rate: 1 ETH = 1 PNK Balance: ${
                      PNKBalance.data.tokenBalance
                    }`
                  }}
                  onSubmit={buyPNK}
                />
                <Button
                  onClick={submitBuyPNKForm}
                  disabled={buyPNKFormIsInvalid}
                  className="TestingPanel-form-button"
                >
                  BUY NOW
                </Button>
              </div>
            ),
            failedLoading: 'There was an error fetching your PNK balance.'
          })}
        </div>
        <div className="TestingPanel-form">
          {renderIf(arbitratorData, {
            loading: <Icosahedron />,
            done: arbitratorData.data && (
              <div>
                <PassPeriodForm
                  enableReinitialize
                  initialValues={{
                    currentPeriod: `Current Period: ${camelToTitleCase(
                      PERIOD_ENUM[arbitratorData.data.period]
                    )}`,
                    currentSession: `Current Session: ${
                      arbitratorData.data.session
                    }`
                  }}
                  onSubmit={passPeriod}
                />
                <Button
                  onClick={submitPassPeriodForm}
                  disabled={passPeriodFormIsInvalid}
                  className="TestingPanel-form-button TestingPanel-form-button--nextPeriod"
                >
                  NEXT PERIOD
                </Button>
              </div>
            ),
            failedLoading: 'There was an error fetching the arbitrator data.'
          })}
        </div>
      </div>
    )
  }
}

TestingPanel.propTypes = {
  // Redux State
  PNKBalance: arbitratorSelectors.PNKBalanceShape.isRequired,
  arbitratorData: arbitratorSelectors.arbitratorDataShape.isRequired,

  // Action Dispatchers
  fetchPNKBalance: PropTypes.func.isRequired,
  buyPNK: PropTypes.func.isRequired,
  fetchArbitratorData: PropTypes.func.isRequired,
  passPeriod: PropTypes.func.isRequired,

  // buyPNKForm
  buyPNKFormIsInvalid: PropTypes.bool.isRequired,
  submitBuyPNKForm: PropTypes.func.isRequired,

  // passPeriodForm
  passPeriodFormIsInvalid: PropTypes.bool.isRequired,
  submitPassPeriodForm: PropTypes.func.isRequired
}

export default connect(
  state => ({
    PNKBalance: state.arbitrator.PNKBalance,
    arbitratorData: state.arbitrator.arbitratorData,
    buyPNKFormIsInvalid: getBuyPNKFormIsInvalid(state),
    passPeriodFormIsInvalid: getPassPeriodFormIsInvalid(state)
  }),
  {
    fetchPNKBalance: arbitratorActions.fetchPNKBalance,
    buyPNK: arbitratorActions.buyPNK,
    fetchArbitratorData: arbitratorActions.fetchArbitratorData,
    passPeriod: arbitratorActions.passPeriod,
    submitBuyPNKForm,
    submitPassPeriodForm
  }
)(TestingPanel)
