import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as disputeActions from '../../actions/dispute'
import * as disputeSelectors from '../../reducers/dispute'
import { renderIf } from '../../utils/react-redux'
import { formatDateString } from '../../utils/date'
import Table from '../../components/table'
import StatusHint from '../../components/status-hint'

import CaseNameCell from './case-name-cell'

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
            Header: 'Dispute ID',
            accessor: 'id'
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
        {renderIf(
          [disputes.loading],
          [disputes.data],
          [disputes.failedLoading],
          {
            loading: table,
            done: table,
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
