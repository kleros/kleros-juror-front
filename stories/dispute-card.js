import React from 'react'
import { storiesOf } from '@storybook/react'

import DisputeCard from '../src/components/dispute-card'

storiesOf('Dispute Card', module)
  .add('waiting', () => (
    <DisputeCard
      status={0}
      subcourt="SUBCOURT"
      date={new Date(Date.now() - 1e10)}
      title="Unknown Website Owner Claims Services Were Not Delivered"
    />
  ))
  .add('appealable', () => (
    <DisputeCard
      status={1}
      subcourt="SUBCOURT"
      date={new Date(Date.now() - 0.9e10)}
      title="Unknown Website Owner Claims Services Were Not Delivered"
    />
  ))
  .add('resolved', () => (
    <DisputeCard
      status={2}
      subcourt="SUBCOURT"
      date={new Date(Date.now() - 0.8e10)}
      title="Unknown Website Owner Claims Services Were Not Delivered"
    />
  ))
