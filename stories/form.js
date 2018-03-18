import React from 'react'
import { storiesOf } from '@storybook/react'

import FormHeader from '../src/components/form-header'
import FormInfo from '../src/components/form-info'

storiesOf('Form', module)
  .add('header', () => <FormHeader title="PLACEHOLDER" />)
  .add('info', () => <FormInfo input={{ value: 'PLACEHOLDER' }} />)
