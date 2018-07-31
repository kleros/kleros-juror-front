import { mount } from 'enzyme'
import React from 'react'

import Slider from '.'

const width = 100
const calcValue = percent => percent * width

it('Renders and handles mouse events.', () => {
  const wrapper = mount(
    <Slider
      startLabel="startLabel"
      endLabel="endLabel"
      initialPercent={0.5}
      steps={[
        {
          label: 'label 1',
          percent: 0.4,
          color: 'color',
          point: true
        },
        {
          label: 'label 2',
          percent: 0.6,
          color: 'color'
        }
      ]}
      calcValue={calcValue}
    />
  )
  wrapper.find('.Slider-bar').simulate('mousemove', { pageX: width / 2 })
})
