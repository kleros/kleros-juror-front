import React from 'react'
import { storiesOf } from '@storybook/react'

import Icosahedron from '../src/components/icosahedron'

storiesOf('Icosahedron', module).add('default', () => (
  <Icosahedron size={200} />
))
