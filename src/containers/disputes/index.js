import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { RenderIf } from 'lessdux'

import * as disputeSelectors from '../../reducers/dispute'
import * as disputeActions from '../../actions/dispute'

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
        <RenderIf
          resource={disputes}
          loading={table}
          done={table}
          failedLoading="There was an error fetching your disputes."
        />
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
