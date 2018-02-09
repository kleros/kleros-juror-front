import React from 'react'
import { storiesOf } from '@storybook/react'

import LabelValueGroup from '../src/components/label-value-group'

storiesOf('Label Value Group', module).add('default', () => (
  <LabelValueGroup
    items={[
      {
        label: 'Party A',
        value: 'Placeholder 1',
        identiconSeed: 'Placeholder 1'
      },
      {
        label: 'Party B',
        value: 'Placeholder 2',
        identiconSeed: 'Placeholder 2'
      },
      { label: 'Arbitration Fee', value: '10 PNK' }
    ]}
  />
))
