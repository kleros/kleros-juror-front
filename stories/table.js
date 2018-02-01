import React from 'react'
import { storiesOf } from '@storybook/react'

import { formatDateString } from '../src/utils/date'
import Table from '../src/components/table'
import CaseNameCell from '../src/containers/disputes/case-name-cell'
import StatusHint from '../src/components/status-hint'

const deadline = new Date(Date.now() - 1e10)
const data = [0, 1, 2, 3].map(n => ({
  id: `#${n}`,
  arbitrableContractAddress: `${n}XXXXX`,
  arbitrableContractTitle: `Website Design ${n}`,
  status: n,
  deadline
}))

storiesOf('Table', module).add('default', () => (
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
    data={data}
  />
))
