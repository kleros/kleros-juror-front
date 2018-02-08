import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as disputeSelectors from '../../reducers/dispute'
import * as disputeActions from '../../actions/dispute'
import AnchoredList from '../../components/anchored-list'

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
    const { fetchDispute } = this.props
    fetchDispute()
  }

  render() {
    const { match: { params: { disputeID } }, dispute } = this.props

    return (
      <div className="Dispute">
        <AnchoredList
          items={[
            {
              element: (
                <div key={0}>
                  {disputeID}: {dispute.data}
                </div>
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
