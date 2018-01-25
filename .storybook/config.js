import React from 'react'
import { configure, addDecorator } from '@storybook/react'
import { host } from 'storybook-host'

import GlobalComponents from '../src/bootstrap/global-components'

import '../src/bootstrap/app.css'

addDecorator(
  host({
    title: 'Kleros UI-Kit',
    align: 'center middle'
  })
)
addDecorator(story => (
  <div>
    {story()}
    <GlobalComponents />
  </div>
))
configure(() => require('../stories/index.js'), module)
