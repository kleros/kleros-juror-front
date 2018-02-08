import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as disputeSelectors from '../../reducers/dispute'
import * as disputeActions from '../../actions/dispute'
import { renderIf } from '../../utils/redux'
import { formatDateString } from '../../utils/date'
import Table from '../../components/table'
import StatusHint from '../../components/status-hint'

import CaseNameCell from './case-name-cell'

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

    const table = (
      <Table
        columns={[
          {
            Header: 'Case Name',
            minWidth: 220,
            accessor: 'arbitrableContractTitle',
            Cell: CaseNameCell
          },
          {
            id: 'subcourt',
            Header: 'Subcourt',
            accessor: () => 'Unknown subcourt'
          },
          {
            Header: 'Deadline',
            maxWidth: 110,
            accessor: 'deadline',
            Cell: cell => formatDateString(cell.value)
          },
          {
            Header: 'Status',
            maxWidth: 80,
            accessor: 'status',
            Cell: cell => <StatusHint status={cell.value} />
          }
        ]}
        loading={disputes.loading}
        data={disputes.data}
      />
    )
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
