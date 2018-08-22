import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'

import { ChainData } from '../../chainstrap'
import { ARBITRATOR_ADDRESS } from '../../bootstrap/dapp-api'
import * as disputeSelectors from '../../reducers/dispute'
import * as disputeActions from '../../actions/dispute'
import { dateToString } from '../../utils/date'
import Icosahedron from '../../components/icosahedron'
import AnchoredList from '../../components/anchored-list'
import Identicon from '../../components/identicon'
import Button from '../../components/button'
import * as disputeConstants from '../../constants/dispute'
import * as chainViewConstants from '../../constants/chain-view'

import Details from './components/details'
import Evidence from './components/evidence'
import Ruling from './components/ruling'

import './dispute.css'

class Dispute extends PureComponent {
  static propTypes = {
    // React Router
    match: PropTypes.shape({
      params: PropTypes.shape({ disputeID: PropTypes.string.isRequired })
        .isRequired
    }).isRequired,

    // Redux State
    dispute: disputeSelectors.disputeShape.isRequired,

    // Action Dispatchers
    fetchDispute: PropTypes.func.isRequired,
    voteOnDispute: PropTypes.func.isRequired,
    repartitionTokens: PropTypes.func.isRequired,
    executeRuling: PropTypes.func.isRequired
  }

  componentDidMount() {
    const {
      match: {
        params: { disputeID }
      },
      fetchDispute
    } = this.props
    fetchDispute(Number(disputeID))
  }

  handleVoteButtonClick = ({ currentTarget: { id } }) => {
    const { dispute, voteOnDispute } = this.props
    voteOnDispute(
      dispute.data.disputeId,
      dispute.data.appealJuror[dispute.data.latestAppealForJuror].draws,
      id
    )
  }

  handleRepartitionButtonClick = () => {
    const { dispute, repartitionTokens } = this.props
    repartitionTokens(dispute.data.disputeId)
  }

  handleExecuteButtonClick = () => {
    const { dispute, executeRuling } = this.props
    executeRuling(dispute.data.disputeId)
  }

  render() {
    const { dispute } = this.props
    const today = new Date()
    return (
      <div className="Dispute">
        <RenderIf
          resource={dispute}
          loading={<Icosahedron />}
          done={
            dispute.data && (
              <AnchoredList
                items={[
                  {
                    element: (
                      <div key={0} className="Dispute-header">
                        <small>
                          {dateToString(today, {
                            withTime: false
                          })}
                        </small>
                        <div className="Dispute-header-title">
                          <Identicon
                            seed={dispute.data.arbitrableContractAddress}
                            size={12}
                            className="Dispute-header-title-identicon"
                          />
                          <h3>
                            Decision Summary for "
                            {dispute.data.metaEvidence.title}
                            ", Case #{dispute.data.disputeId}
                          </h3>
                        </div>
                        <hr />
                      </div>
                    )
                  },
                  {
                    anchor: 'Details',
                    element: (
                      <Details
                        key={dispute.data.appealCreatedAt[0] || 1}
                        date={dispute.data.appealCreatedAt[0] || today}
                        arbitrationFee={dispute.data.appealJuror[0].fee}
                        arbitrableContractAddress={
                          dispute.data.arbitrableContractAddress
                        }
                        disputeID={dispute.data.disputeId}
                        metaEvidence={dispute.data.metaEvidence}
                      />
                    )
                  },
                  ...dispute.data.events.map(e => {
                    switch (e.type) {
                      case disputeConstants.EVENT_TYPE_ENUM[0]:
                        return {
                          anchor: 'Appeal',
                          element: (
                            <Details
                              key={e.date}
                              date={e.date}
                              arbitrationFee={e.fee}
                              arbitrableContractAddress={
                                dispute.data.arbitrableContractAddress
                              }
                              disputeID={dispute.data.disputeId}
                              appealNumber={e.appealNumber}
                              metaEvidence={dispute.data.metaEvidence}
                            />
                          )
                        }
                      case disputeConstants.EVENT_TYPE_ENUM[1]:
                        return {
                          anchor: 'Evidence',
                          element: (
                            <Evidence
                              key={e.date + e.url}
                              date={e.date}
                              partyAddress={e.submittedBy}
                              title={e.name}
                              description={e.description}
                              URL={e.URI}
                              arbitrableContractAddress={
                                dispute.data.arbitrableContractAddress
                              }
                              isPartyA={e.submitter === dispute.data.partyA}
                            />
                          )
                        }
                      case disputeConstants.EVENT_TYPE_ENUM[2]:
                        return {
                          anchor: 'Ruling',
                          element: (
                            <Ruling
                              key={e.date}
                              date={e.date}
                              votesForPartyA={e.voteCounter[1]}
                              votesForPartyB={e.voteCounter[2]}
                              netPNK={dispute.data.netPNK}
                              jurorRuling={
                                dispute.data.appealJuror[e.appealNumber]
                                  .jurorRuling
                              }
                              disputeID={dispute.data.disputeId}
                              appeals={dispute.data.numberOfAppeals}
                              appealNumber={e.appealNumber}
                              metaEvidence={dispute.data.metaEvidence}
                            />
                          )
                        }
                      default:
                        return null
                    }
                  }),
                  dispute.data.appealJuror[dispute.data.numberOfAppeals].canRule
                    ? {
                        anchor: 'Vote',
                        element: (
                          <div key={today} className="Dispute-action">
                            <div>
                              <p>
                                {
                                  dispute.data.metaEvidence.rulingOptions
                                    .descriptions[0]
                                }
                              </p>
                              <Button
                                id={1}
                                onClick={this.handleVoteButtonClick}
                              >
                                <ChainData
                                  contractName={
                                    chainViewConstants.KLEROS_POC_NAME
                                  }
                                  contractAddress={ARBITRATOR_ADDRESS}
                                  functionSignature={
                                    chainViewConstants.KLEROS_POC_VOTE_RULING_SIG
                                  }
                                  parameters={chainViewConstants.KLEROS_POC_VOTE_RULING_PARAMS()}
                                  estimatedGas={
                                    chainViewConstants.KLEROS_POC_VOTE_RULING_GAS
                                  }
                                >
                                  {
                                    dispute.data.metaEvidence.rulingOptions
                                      .titles[0]
                                  }
                                </ChainData>
                              </Button>
                            </div>
                            <div>
                              <p>
                                {
                                  dispute.data.metaEvidence.rulingOptions
                                    .descriptions[1]
                                }
                              </p>
                              <Button
                                id={2}
                                onClick={this.handleVoteButtonClick}
                              >
                                <ChainData
                                  contractName={
                                    chainViewConstants.KLEROS_POC_NAME
                                  }
                                  contractAddress={ARBITRATOR_ADDRESS}
                                  functionSignature={
                                    chainViewConstants.KLEROS_POC_VOTE_RULING_SIG
                                  }
                                  parameters={chainViewConstants.KLEROS_POC_VOTE_RULING_PARAMS()}
                                  estimatedGas={
                                    chainViewConstants.KLEROS_POC_VOTE_RULING_GAS
                                  }
                                >
                                  {
                                    dispute.data.metaEvidence.rulingOptions
                                      .titles[1]
                                  }
                                </ChainData>
                              </Button>
                            </div>
                          </div>
                        )
                      }
                    : dispute.data.appealRulings[dispute.data.numberOfAppeals]
                        .canRepartition
                      ? {
                          anchor: 'Repartition Tokens',
                          element: (
                            <div key={today} className="Dispute-action">
                              <Button
                                onClick={this.handleRepartitionButtonClick}
                              >
                                <ChainData
                                  contractName={
                                    chainViewConstants.KLEROS_POC_NAME
                                  }
                                  contractAddress={ARBITRATOR_ADDRESS}
                                  functionSignature={
                                    chainViewConstants.KLEROS_POC_ONE_SHOT_TOKEN_REPARTITION_SIG
                                  }
                                  parameters={chainViewConstants.KLEROS_POC_ONE_SHOT_TOKEN_REPARTITION_PARAMS()}
                                  estimatedGas={
                                    chainViewConstants.KLEROS_POC_ONE_SHOT_TOKEN_REPARTITION_GAS
                                  }
                                >
                                  Repartition Tokens
                                </ChainData>
                              </Button>
                            </div>
                          )
                        }
                      : dispute.data.appealRulings[dispute.data.numberOfAppeals]
                          .canExecute
                        ? {
                            anchor: 'Execute Ruling',
                            element: (
                              <div key={today} className="Dispute-action">
                                <Button onClick={this.handleExecuteButtonClick}>
                                  <ChainData
                                    contractName={
                                      chainViewConstants.KLEROS_POC_NAME
                                    }
                                    contractAddress={ARBITRATOR_ADDRESS}
                                    functionSignature={
                                      chainViewConstants.KLEROS_POC_EXECUTE_RULING_SIG
                                    }
                                    parameters={chainViewConstants.KLEROS_POC_EXECUTE_RULING_PARAMS()}
                                    estimatedGas={
                                      chainViewConstants.KLEROS_POC_EXECUTE_RULING_GAS
                                    }
                                  >
                                    Execute Ruling
                                  </ChainData>
                                </Button>
                              </div>
                            )
                          }
                        : null
                ]}
              />
            )
          }
          failedLoading="Failed to fetch dispute."
        />
      </div>
    )
  }
}

export default connect(
  state => ({ dispute: state.dispute.dispute }),
  {
    fetchDispute: disputeActions.fetchDispute,
    voteOnDispute: disputeActions.voteOnDispute,
    repartitionTokens: disputeActions.repartitionTokens,
    executeRuling: disputeActions.executeRuling
  }
)(Dispute)
