import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as disputeSelectors from '../../reducers/dispute'
import * as disputeActions from '../../actions/dispute'
import { renderIf } from '../../utils/redux'
import { dateToString } from '../../utils/date'
import Icosahedron from '../../components/icosahedron'
import AnchoredList from '../../components/anchored-list'
import Identicon from '../../components/identicon'
import Button from '../../components/button'

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

    return (
      <div className="Dispute">
        {renderIf(dispute, {
          loading: <Icosahedron />,
          done: dispute.data && (
            <AnchoredList
              items={[
                {
                  element: (
                    <div key={0} className="Dispute-header">
                      <small>
                        {dateToString(new Date(), {
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
                      key={1}
                      date={new Date()}
                      partyAAddress={dispute.data.partyA}
                      partyBAddress={dispute.data.partyB}
                      arbitrationFee={dispute.data.fee}
                    />
                  )
                },
                ...dispute.data.evidence.map(e => ({
                  anchor: 'Evidence',
                  element: (
                    <Evidence
                      key={e.url}
                      date={new Date()}
                      partyAddress={e.submitter}
                      URI={e.url}
                    />
                  )
                })),
                {
                  anchor: 'Ruling',
                  element: (
                    <Ruling
                      key={2}
                      date={new Date()}
                      votesForPartyA={dispute.data.ruling}
                      votesForPartyB={dispute.data.ruling}
                      netPNK={0}
                    />
                  )
                },
                ...(dispute.data.hasRuled
                  ? []
                  : [
                      {
                        anchor: 'Vote',
                        element: (
                          <div key={3} className="Dispute-vote">
                            <Button id={0} onClick={this.handleVoteButtonClick}>
                              Vote for Party A
                            </Button>
                            <Button id={1} onClick={this.handleVoteButtonClick}>
                              Vote for Party B
                            </Button>
                          </div>
                        )
                      }
                    ])
              ]}
            />
          ),
          failed: 'Failed to fetch dispute.'
        })}
      </div>
    )
  }
}

export default connect(state => ({ dispute: state.dispute.dispute }), {
  fetchDispute: disputeActions.fetchDispute,
  voteOnDispute: disputeActions.voteOnDispute
})(Dispute)
