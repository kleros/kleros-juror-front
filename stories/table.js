import React from 'react'
import { storiesOf } from '@storybook/react'

import { dateToString } from '../src/utils/date'
import Table from '../src/components/table'
import CaseNameCell from '../src/containers/disputes/components/case-name-cell'
import StatusHint from '../src/components/status-hint'

const deadline = new Date(Date.now() - 1e10)
const data = [0, 1, 2, 3].map(n => ({
  disputeId: n,
  arbitrableContractAddress: `${n}XXXXX`,
  description: `Website Design ${n}`,
  deadline,
  status: n
}))

storiesOf('Table', module).add('default', () => (
  <Table
    columns={[
      {
        Header: 'Case Name',
        minWidth: 220,
        accessor: 'description',
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
        Cell: cell => dateToString(cell.value, { withYear: false })
      },
      {
        Header: 'Status',
        maxWidth: 80,
        accessor: 'status',
        Cell: cell => <StatusHint status={cell.value} />
      }
    ]}
    data={data}
  />
))
