import React from 'react'

import * as disputeSelectors from '../../../../reducers/dispute'
import { dateToString } from '../../../../utils/date'
import Table from '../../../../components/table'
import StatusHint from '../../../../components/status-hint'
import CaseNameCell from '../case-name-cell'

const columns = [
  {
    Header: 'Case Name',
    minWidth: 220,
    accessor: 'description',
    Cell: CaseNameCell
  },
  {
    id: 'subcourt',
    Header: 'Subcourt',
    accessor: () => 'General Court'
  },
  {
    id: 'deadline',
    Header: 'Deadline',
    maxWidth: 110,
    accessor: d => d.appealRulings[d.numberOfAppeals].deadline || null,
    Cell: cell =>
      cell.value === null
        ? 'None'
        : dateToString(cell.value, { withYear: false })
  },
  {
    Header: 'Status',
    maxWidth: 80,
    accessor: 'disputeStatus',
    Cell: cell => <StatusHint status={cell.value} />
  }
]

const DisputesTable = ({ disputes }) => (
  <Table columns={columns} loading={disputes.loading} data={disputes.data} />
)

DisputesTable.propTypes = {
  // Redux State
  disputes: disputeSelectors.disputesShape.isRequired
}

export default DisputesTable
