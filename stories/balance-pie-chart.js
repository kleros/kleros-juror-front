import React from 'react'
import { storiesOf } from '@storybook/react'

import BalancePieChart from '../src/components/balance-pie-chart'

storiesOf('Balance Pie Chart', module)
  .add('activated', () => (
    <BalancePieChart type="activated" balance={20} total={100} size={80} />
  ))
  .add('locked', () => (
    <BalancePieChart type="locked" balance={80} total={100} size={80} />
  ))
