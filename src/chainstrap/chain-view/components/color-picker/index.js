import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { TwitterPicker } from 'react-color'

import './color-picker.css'

class ColorPicker extends PureComponent {
  static propTypes = {
    // State
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,

    // Handlers
    onSelect: PropTypes.func.isRequired
  }

  state = {
    isOpen: false
  }

  handleToggleClick = () =>
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))

  handleOnChangeComplete = color => {
    const { id, onSelect } = this.props
    onSelect(id, color)
  }

  render() {
    const { value } = this.props
    const { isOpen } = this.state

    return (
      <div className="ColorPicker">
        <FontAwesomeIcon
          className="ColorPicker-icon"
          style={{ color: value }}
          icon="eye-dropper"
          onClick={this.handleToggleClick}
        />
        {isOpen && (
          <TwitterPicker
            className="ColorPicker-picker"
            triangle="top-right"
            color={value}
            onChangeComplete={this.handleOnChangeComplete}
          />
        )}
      </div>
    )
  }
}

export default ColorPicker
