import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as disputeActions from '../../actions/dispute'
import * as disputeSelectors from '../../reducers/dispute'
import { renderIf } from '../../utils/react-redux'

import './disputes.css'

class Disputes extends Component {
  static propTypes = {
    disputes: disputeSelectors.disputesShape.isRequired,
    fetchDisputes: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fetchDisputes } = this.props
    fetchDisputes()
  }

  render() {
    const { disputes } = this.props

    return (
      <div className="Disputes">
        {renderIf(
          [disputes.loading],
          [disputes.data],
          [disputes.failedLoading],
          {
            loading: 'Loading disputes...',
            done: disputes.data && (
              <span>You have {disputes.data.length} disputes</span>
            ),
            failed: <span>There was an error fetching your disputes.</span>
          }
        )}
      </div>
    )
  }
}

Disputes.propTypes = {}

export default connect(
  state => ({
    disputes: state.dispute.disputes
  }),
  {
    fetchDisputes: disputeActions.fetchDisputes
  }
)(Disputes)
