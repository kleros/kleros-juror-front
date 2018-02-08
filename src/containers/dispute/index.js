import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as disputeSelectors from '../../reducers/dispute'
import * as disputeActions from '../../actions/dispute'
import { dateToString } from '../../utils/date'
import AnchoredList from '../../components/anchored-list'
import Identicon from '../../components/identicon'

import Details from './details'

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
    fetchDispute(disputeID)
  }

  render() {
    const { dispute } = this.props
    console.log(dispute)
    return (
      <div className="Dispute">
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
                    <h3>Decision Summary for XYZ Case</h3>
                  </div>
                  <hr />
                </div>
              )
            },
            {
              anchor: 'Details',
              element: (
                <Details
                  date={new Date()}
                  partyAAddress="Placeholder1"
                  partyBAddress="Placeholder2"
                  arbitrationFee={5}
                />
              )
            },
            ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(n => ({
              anchor: n.toString(),
              element: <div key={n}>4</div>
            }))
          ]}
        />
      </div>
    )
  }
}

export default connect(state => ({ dispute: state.dispute.dispute }), {
  fetchDispute: disputeActions.fetchDispute
})(Dispute)
