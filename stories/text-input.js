import React from 'react'
import { storiesOf } from '@storybook/react'
import { withState } from '@dump247/storybook-state'

import TextInput from '../src/components/text-input'

const render = store => (
  <TextInput
    {...store.state}
    input={{
      ...store.state.input,
      onChange: event =>
        store.set({
          input: { value: event.target.value, onChange: null }
        })
    }}
  />
)

storiesOf('Text Input', module)
  .add(
    'default',
    withState(
      {
        placeholder: 'EMAIL',
        input: { value: '', onChange: null },
        meta: { valid: undefined, touched: undefined, error: undefined }
      },
      render
    )
  )
  .add(
    'touched',
    withState(
      {
        placeholder: 'EMAIL',
        input: { value: '', onChange: null },
        meta: { valid: undefined, touched: true, error: undefined }
      },
      render
    )
  )
  .add(
    'valid',
    withState(
      {
        placeholder: 'EMAIL',
        input: { value: '', onChange: null },
        meta: { valid: true, touched: undefined, error: undefined }
      },
      render
    )
  )
  .add(
    'error',
    withState(
      {
        placeholder: 'EMAIL',
        input: { value: '', onChange: null },
        meta: {
          valid: undefined,
          touched: undefined,
          error: 'Please enter a valid email.'
        }
      },
      render
    )
  )
