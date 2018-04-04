import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import './togglable-icon.css'

const TogglableIcon = ({ on, off, value, onClick }) => (
  <FontAwesomeIcon
    className="TogglableIcon"
    icon={value ? on : off}
    onClick={onClick}
  />
)

TogglableIcon.propTypes = {
  // State
  on: PropTypes.string.isRequired,
  off: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,

  // Handlers
  onClick: PropTypes.func.isRequired
}

export default TogglableIcon
