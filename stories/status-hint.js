import React from 'react'
import { storiesOf } from '@storybook/react'

import StatusHint from '../src/components/status-hint'

storiesOf('Status Hint', module)
  .add('waiting', () => <StatusHint status={0} />)
  .add('appealable', () => <StatusHint status={1} />)
  .add('resolved', () => <StatusHint status={2} />)
