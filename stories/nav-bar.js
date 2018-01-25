import React from 'react'
import PropTypes from 'prop-types'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'

import NavBar from '../src/components/nav-bar'

const routes = [
  { name: 'Home', to: '/' },
  { name: 'Disputes', to: '/disputes' },
  { name: 'Testing Panel', to: '/testing-panel' }
]

const Wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/']}>
    <div style={{ width: '700px' }}>{children}</div>
  </MemoryRouter>
)

Wrapper.propTypes = {
  children: PropTypes.element.isRequired
}

storiesOf('Nav Bar', module)
  .add('with routes', () => (
    <Wrapper>
      <NavBar
        routes={[
          { name: 'Home', to: '/' },
          { name: 'Disputes', to: '/disputes' },
          { name: 'Testing Panel', to: '/testing-panel' }
        ]}
      />
    </Wrapper>
  ))
  .add('with a lot of routes, (scrollable)', () => (
    <Wrapper>
      <NavBar
        routes={[
          ...routes,
          { name: 'Extra', to: '/1' },
          { name: 'Extra', to: '/2' },
          { name: 'Extra', to: '/3' },
          { name: 'Extra', to: '/4' },
          { name: 'Extra', to: '/5' },
          { name: 'Extra', to: '/6' }
        ]}
      />
    </Wrapper>
  ))
