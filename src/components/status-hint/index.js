import React from 'react'
import PropTypes from 'prop-types'

import { STATUS_ENUM } from '../../constants/dispute'

import './status-hint.css'

const StatusHint = ({ status, className }) => (
  <div
    className={`StatusHint ${`StatusHint--${
      STATUS_ENUM[status]
    }`} ${className}`}
    data-tip={STATUS_ENUM[status]}
    data-type="info"
  />
)

StatusHint.propTypes = {
  // State
  status: PropTypes.number.isRequired,

  // Modifiers
  className: PropTypes.string
}

StatusHint.defaultProps = {
  // Modifiers
  className: ''
}

export default StatusHint
