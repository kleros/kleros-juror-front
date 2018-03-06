import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as disputeSelectors from '../../reducers/dispute'
import * as disputeActions from '../../actions/dispute'
import { RenderIf } from '../../utils/redux'
import { dateToString } from '../../utils/date'
import Icosahedron from '../../components/icosahedron'
import AnchoredList from '../../components/anchored-list'
import Identicon from '../../components/identicon'
import Button from '../../components/button'
import { EVENT_TYPE_ENUM } from '../../constants/dispute'

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
    voteOnDispute: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { match: { params: { disputeID } }, fetchDispute } = this.props
    fetchDispute(Number(disputeID))
  }

  handleVoteButtonClick = event => {
    const { dispute, voteOnDispute } = this.props
    voteOnDispute(
      dispute.data.disputeId,
      dispute.data.votes,
      event.currentTarget.id
    )
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
                            Decision Summary for "{dispute.data.description}"
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
                        partyAAddress={dispute.data.partyA}
                        partyBAddress={dispute.data.partyB}
                        arbitrationFee={dispute.data.appealJuror[0].fee}
                      />
                    )
                  },
                  ...dispute.data.events.map(e => {
                    switch (e.type) {
                      case EVENT_TYPE_ENUM[0]:
                        return {
                          anchor: 'Appeal',
                          element: (
                            <Details
                              key={e.date}
                              date={e.date}
                              partyAAddress={dispute.data.partyA}
                              partyBAddress={dispute.data.partyB}
                              arbitrationFee={e.fee}
                            />
                          )
                        }
                      case EVENT_TYPE_ENUM[1]:
                        return {
                          anchor: 'Evidence',
                          element: (
                            <Evidence
                              key={e.date + e.url}
                              date={e.date}
                              partyAddress={e.submitter}
                              URI={e.url}
                            />
                          )
                        }
                      case EVENT_TYPE_ENUM[2]:
                        return {
                          anchor: 'Ruling',
                          element: (
                            <Ruling
                              key={e.date}
                              date={e.date}
                              votesForPartyA={e.voteCounter[0]}
                              votesForPartyB={e.voteCounter[1]}
                              netPNK={dispute.data.netPNK}
                            />
                          )
                        }
                      default:
                        return null
                    }
                  }),
                  dispute.data.appealJuror[dispute.data.numberOfAppeals]
                    .canRule && [
                    {
                      anchor: 'Vote',
                      element: (
                        <div key={today} className="Dispute-vote">
                          <Button id={0} onClick={this.handleVoteButtonClick}>
                            Vote for Party A
                          </Button>
                          <Button id={1} onClick={this.handleVoteButtonClick}>
                            Vote for Party B
                          </Button>
                        </div>
                      )
                    }
                  ]
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

export default connect(state => ({ dispute: state.dispute.dispute }), {
  fetchDispute: disputeActions.fetchDispute,
  voteOnDispute: disputeActions.voteOnDispute
})(Dispute)
