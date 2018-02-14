import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as disputeSelectors from '../../reducers/dispute'
import * as disputeActions from '../../actions/dispute'
import { renderIf } from '../../utils/redux'
import { dateToString } from '../../utils/date'
import AnchoredList from '../../components/anchored-list'
import Identicon from '../../components/identicon'

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
    fetchDispute: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { match: { params: { disputeID } }, fetchDispute } = this.props
    fetchDispute(Number(disputeID))
  }

  render() {
    const { dispute } = this.props

    return (
      <div className="Dispute">
        {renderIf(dispute, {
          loading: 'Loading dispute...',
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
                          seed="Placeholder"
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
                {
                  anchor: 'Evidence',
                  element: (
                    <Evidence
                      key={2}
                      date={new Date()}
                      partyAddress={dispute.data.partyA}
                      URIs={dispute.data.evidence}
                    />
                  )
                },
                {
                  anchor: 'Ruling',
                  element: (
                    <Ruling
                      key={3}
                      date={new Date()}
                      votesForPartyA={33}
                      votesForPartyB={78}
                      netPNK={10}
                    />
                  )
                }
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
  fetchDispute: disputeActions.fetchDispute
})(Dispute)
