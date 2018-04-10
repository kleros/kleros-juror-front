import React from 'react'
import { storiesOf } from '@storybook/react'

import { dateToString } from '../src/utils/date'
import Table from '../src/components/table'
import StatusHint from '../src/components/status-hint'

const columns = [
  {
    Header: 'Case Name',
    minWidth: 220,
    accessor: 'description'
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
    accessor: 'disputeStatus',
    Cell: cell => <StatusHint status={cell.value} />
  }
]
const deadline = new Date(Date.now() - 1e10)
const data = [0, 1, 2, 3].map(n => ({
  disputeId: n,
  disputeStatus: n % 3,
  description: `Website Design ${n}`,
  deadline,
  arbitrableContractAddress: `${n}XXXXX`
}))

storiesOf('Table', module).add('default', () => (
  <Table columns={columns} data={data} />
))
