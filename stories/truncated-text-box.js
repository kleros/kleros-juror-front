import React from 'react'
import { storiesOf } from '@storybook/react'

import TruncatedTextBox from '../src/components/truncated-text-box'

storiesOf('Truncated Text Box', module)
  .add('default', () => (
    <TruncatedTextBox
      text="Duis et mauris vestibulum, auctor lacus porttitor, pellentesque arcu.
  Sed scelerisque dolor in orci luctus semper. Mauris turpis magna, congue
  vitae sollicitudin vel, pretium nec arcu."
      maxWords={10}
    />
  ))
  .add('not exceeding max words', () => (
    <TruncatedTextBox
      text="Duis et mauris vestibulum, auctor lacus porttitor, pellentesque arcu.
  Sed scelerisque dolor in orci luctus semper. Mauris turpis magna, congue
  vitae sollicitudin vel, pretium nec arcu."
      maxWords={100}
    />
  ))
