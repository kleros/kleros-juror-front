import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'

import { ChainData } from '../../chainstrap'
import { arbitratorAddress } from '../../bootstrap/dapp-api'
import * as walletSelectors from '../../reducers/wallet'
import * as walletActions from '../../actions/wallet'
import * as arbitratorSelectors from '../../reducers/arbitrator'
import * as arbitratorActions from '../../actions/arbitrator'
import { camelToTitleCase } from '../../utils/string'
import Icosahedron from '../../components/icosahedron'
import Button from '../../components/button'
import * as arbitratorConstants from '../../constants/arbitrator'
import * as chainViewConstants from '../../constants/chain-view'

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
  static propTypes = {
    // Redux State
    accounts: walletSelectors.accountsShape.isRequired,
    balance: walletSelectors.balanceShape.isRequired,
    PNKBalance: arbitratorSelectors.PNKBalanceShape.isRequired,
    arbitratorData: arbitratorSelectors.arbitratorDataShape.isRequired,

    // Action Dispatchers
    fetchBalance: PropTypes.func.isRequired,
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

  componentDidMount() {
    const { fetchBalance, fetchPNKBalance, fetchArbitratorData } = this.props
    fetchBalance()
    fetchPNKBalance()
    fetchArbitratorData()
  }

  render() {
    const {
      accounts,
      balance,
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
          <RenderIf
            resource={balance}
            loading={<Icosahedron />}
            done={
              balance.data && (
                <RenderIf
                  resource={PNKBalance}
                  loading={<Icosahedron />}
                  done={
                    PNKBalance.data && (
                      <div>
                        <BuyPNKForm
                          enableReinitialize
                          keepDirtyOnReinitialize
                          initialValues={{
                            rate: (
                              <span>
                                <b>Rate:</b> 1 ETH = 1 PNK
                              </span>
                            ),
                            ETHBalance: (
                              <span>
                                <b>ETH Balance:</b>{' '}
                                <ChainData
                                  contractName={chainViewConstants.WALLET_NAME}
                                  contractAddress={accounts.data[0]}
                                >
                                  {balance.data}
                                </ChainData>
                              </span>
                            ),
                            PNKBalance: (
                              <span>
                                <b>PNK Balance:</b>{' '}
                                <ChainData
                                  contractName={
                                    chainViewConstants.KLEROS_POC_NAME
                                  }
                                  contractAddress={arbitratorAddress}
                                  functionSignature={
                                    chainViewConstants.KLEROS_POC_JURORS_SIG
                                  }
                                  parameters={chainViewConstants.KLEROS_POC_JURORS_PARAMS(
                                    accounts.data[0]
                                  )}
                                >
                                  {PNKBalance.data.tokenBalance}
                                </ChainData>
                              </span>
                            )
                          }}
                          onSubmit={buyPNK}
                        />

                        <Button
                          onClick={submitBuyPNKForm}
                          disabled={buyPNKFormIsInvalid}
                          className="TestingPanel-form-button"
                        >
                          <ChainData
                            contractName={chainViewConstants.KLEROS_POC_NAME}
                            contractAddress={arbitratorAddress}
                            functionSignature={
                              chainViewConstants.KLEROS_POC_BUY_PINAKION_SIG
                            }
                            parameters={chainViewConstants.KLEROS_POC_BUY_PINAKION_PARAMS()}
                            estimatedGas={
                              chainViewConstants.KLEROS_POC_BUY_PINAKION_GAS
                            }
                          >
                            BUY NOW
                          </ChainData>
                        </Button>
                      </div>
                    )
                  }
                  failedLoading="There was an error fetching your PNK balance."
                />
              )
            }
            failedLoading="There was an error fetching your ETH balance."
          />
        </div>
        <div className="TestingPanel-form">
          <RenderIf
            resource={arbitratorData}
            loading={<Icosahedron />}
            done={
              arbitratorData.data && (
                <div>
                  <PassPeriodForm
                    enableReinitialize
                    keepDirtyOnReinitialize
                    initialValues={{
                      currentPeriod: (
                        <span>
                          <b>Current Period:</b>{' '}
                          <ChainData
                            contractName={chainViewConstants.KLEROS_POC_NAME}
                            contractAddress={arbitratorAddress}
                            functionSignature={
                              chainViewConstants.KLEROS_POC_PERIOD_SIG
                            }
                            parameters={chainViewConstants.KLEROS_POC_PERIOD_PARAMS()}
                          >
                            {camelToTitleCase(
                              arbitratorConstants.PERIOD_ENUM[
                                arbitratorData.data.period
                              ]
                            )}
                          </ChainData>
                        </span>
                      ),
                      currentSession: (
                        <span>
                          <b>Current Session:</b>{' '}
                          <ChainData
                            contractName={chainViewConstants.KLEROS_POC_NAME}
                            contractAddress={arbitratorAddress}
                            functionSignature={
                              chainViewConstants.KLEROS_POC_SESSION_SIG
                            }
                            parameters={chainViewConstants.KLEROS_POC_SESSION_PARAMS()}
                          >
                            {arbitratorData.data.session}
                          </ChainData>
                        </span>
                      )
                    }}
                    onSubmit={passPeriod}
                  />

                  <Button
                    onClick={submitPassPeriodForm}
                    disabled={passPeriodFormIsInvalid}
                    className="TestingPanel-form-button TestingPanel-form-button--nextPeriod"
                  >
                    <ChainData
                      contractName={chainViewConstants.KLEROS_POC_NAME}
                      contractAddress={arbitratorAddress}
                      functionSignature={
                        chainViewConstants.KLEROS_POC_PASS_PERIOD_SIG
                      }
                      parameters={chainViewConstants.KLEROS_POC_PASS_PERIOD_PARAMS()}
                      estimatedGas={
                        chainViewConstants.KLEROS_POC_PASS_PERIOD_GAS
                      }
                    >
                      NEXT PERIOD
                    </ChainData>
                  </Button>
                </div>
              )
            }
            failedLoading="There was an error fetching the arbitrator data."
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
    buyPNKFormIsInvalid: getBuyPNKFormIsInvalid(state),
    passPeriodFormIsInvalid: getPassPeriodFormIsInvalid(state)
  }),
  {
    fetchBalance: walletActions.fetchBalance,
    fetchPNKBalance: arbitratorActions.fetchPNKBalance,
    buyPNK: arbitratorActions.buyPNK,
    fetchArbitratorData: arbitratorActions.fetchArbitratorData,
    passPeriod: arbitratorActions.passPeriod,
    submitBuyPNKForm,
    submitPassPeriodForm
  }
)(TestingPanel)
