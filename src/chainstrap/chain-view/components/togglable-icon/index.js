import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import './togglable-icon.css'

const TogglableIcon = ({ id, on, off, value, onClick }) => (
  <FontAwesomeIcon
    icon={value ? on : off}
    className="TogglableIcon"
    id={id}
    data-value={value}
    onClick={onClick}
  />
)

TogglableIcon.propTypes = {
  // State
  id: PropTypes.string.isRequired,
  on: PropTypes.string.isRequired,
  off: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,

  // Handlers
  onClick: PropTypes.func.isRequired
}

export default TogglableIcon
