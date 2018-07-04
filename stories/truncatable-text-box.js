import React from 'react'
import { storiesOf } from '@storybook/react'

import TruncatableTextBox from '../src/components/truncatable-text-box'

storiesOf('Truncatable Text Box', module)
  .add('default', () => (
    <TruncatableTextBox
      text="Duis et mauris vestibulum, auctor lacus porttitor, pellentesque arcu.
  Sed scelerisque dolor in orci luctus semper. Mauris turpis magna, congue
  vitae sollicitudin vel, pretium nec arcu."
      maxWords={10}
    />
  ))
  .add('not exceeding max words', () => (
    <TruncatableTextBox
      text="Duis et mauris vestibulum, auctor lacus porttitor, pellentesque arcu.
  Sed scelerisque dolor in orci luctus semper. Mauris turpis magna, congue
  vitae sollicitudin vel, pretium nec arcu."
      maxWords={100}
    />
  ))
