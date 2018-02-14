import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as disputeSelectors from '../../reducers/dispute'
import * as disputeActions from '../../actions/dispute'
import { renderIf } from '../../utils/redux'

import DisputesTable from './components/disputes-table'

import './disputes.css'

class Disputes extends PureComponent {
  static propTypes = {
    // Redux State
    disputes: disputeSelectors.disputesShape.isRequired,

    // Action Dispatchers
    fetchDisputes: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { fetchDisputes } = this.props
    fetchDisputes()
  }

  render() {
    const { disputes } = this.props

    const table = <DisputesTable disputes={disputes} />
    return (
      <div className="Disputes">
        {renderIf(disputes, {
          loading: table,
          done: table,
          failedLoading: <span>There was an error fetching your disputes.</span>
        })}
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
