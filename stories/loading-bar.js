import React from 'react'
import { storiesOf } from '@storybook/react'

import LoadingBar from '../src/components/loading-bar'

storiesOf('Loading Bar', module).add('default', () => (
  <div style={{ width: '400px' }}>
    <LoadingBar />
  </div>
))
