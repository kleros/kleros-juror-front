import React from 'react'
import { storiesOf } from '@storybook/react'

import AnchoredList from '../src/components/anchored-list'

storiesOf('Anchored List', module).add('default', () => (
  <div style={{ height: '400px' }}>
    <AnchoredList
      items={[
        {
          element: <div key={0}>Dispute ID: 1000</div>
        },
        ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(n => ({
          anchor: n.toString(),
          element: <div key={n}>{n}</div>
        }))
      ]}
    />
  </div>
))
