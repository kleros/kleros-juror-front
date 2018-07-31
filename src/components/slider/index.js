import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { numberToPercentage } from '../../utils/number'

import './slider.css'

export default class Slider extends PureComponent {
  static propTypes = {
    // State
    startLabel: PropTypes.string.isRequired,
    endLabel: PropTypes.string.isRequired,
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        percent: PropTypes.number.isRequired,
        color: PropTypes.string,
        point: PropTypes.bool
      }).isRequired
    )
  }

  static defaultProps = {
    steps: null
  }

  render() {
    const { startLabel, endLabel, steps: _steps } = this.props

    const steps = []
    if (_steps) {
      let accLeftPercent = 0
      for (const step of _steps) {
        let width
        let style
        if (step.point)
          style = {
            left: numberToPercentage(step.percent)
          }
        else {
          width = step.percent - accLeftPercent
          style = {
            left: numberToPercentage(accLeftPercent),
            width: numberToPercentage(width)
          }
          accLeftPercent += width
        }

        steps.push(
          <div
            key={step.label + step.percent}
            className={`Slider-step ${step.point ? 'Slider-step--point' : ''}`}
            style={{
              background: step.color,
              ...style
            }}
          >
            <div className="Slider-step-label">
              <p>{step.label}</p>
            </div>
          </div>
        )
      }
    }

    return (
      <div className="Slider">
        {/* Bar */}
        <div
          ref={this.getBarRef}
          onMouseMove={this.handleBarMouseMove}
          className="Slider-bar"
        />
        {/* Steps */}
        {steps}
        {/* Labels */}
        <div className="Slider-labels">
          <p>{startLabel}</p>
          <p>{endLabel}</p>
        </div>
      </div>
    )
  }
}
