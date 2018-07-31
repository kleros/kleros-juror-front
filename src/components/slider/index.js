import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { numberToPercentage } from '../../utils/number'

import './slider.css'

export default class Slider extends PureComponent {
  static propTypes = {
    // State
    startLabel: PropTypes.string.isRequired,
    endLabel: PropTypes.string.isRequired,
    initialPercent: PropTypes.number.isRequired,
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        percent: PropTypes.number.isRequired,
        color: PropTypes.string,
        point: PropTypes.bool
      }).isRequired
    ),

    // Callbacks
    calcValue: PropTypes.func.isRequired
  }

  static defaultProps = {
    steps: null
  }

  state = {
    left: 0,
    value: null
  }

  barRef = null

  getBarRef = ref => {
    const { initialPercent, calcValue } = this.props

    this.barRef = ref

    /* istanbul ignore if  */
    if (this.barRef && process.env.NODE_ENV !== 'test')
      this.setState({
        left: this.barRef.getBoundingClientRect().width * initialPercent,
        value: calcValue(initialPercent)
      })
  }

  handleBarMouseMove = event => {
    const { calcValue } = this.props

    const boundingClientRect = this.barRef.getBoundingClientRect()
    const left = event.pageX - boundingClientRect.left
    this.setState({
      left,
      value: calcValue(left / boundingClientRect.width)
    })
  }

  render() {
    const { startLabel, endLabel, steps: _steps } = this.props
    const { left, value } = this.state

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
            onMouseMove={this.handleBarMouseMove}
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
        {/* Thumb */}
        <div className="Slider-thumb" style={{ left }} />
        {value && (
          <div className="Slider-value" style={{ left }}>
            <h4>{value}</h4>
          </div>
        )}
        {/* Labels */}
        <div className="Slider-labels">
          <p>{startLabel}</p>
          <p>{endLabel}</p>
        </div>
      </div>
    )
  }
}
