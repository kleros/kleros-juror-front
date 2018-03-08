import React from 'react'
import PropTypes from 'prop-types'

import * as disputeConstants from '../../constants/dispute'

import './status-hint.css'

const StatusHint = ({ status, className }) => (
  <div
    className={`StatusHint ${`StatusHint--${
      disputeConstants.STATUS_ENUM[status]
    }`} ${className}`}
    data-tip={disputeConstants.STATUS_ENUM[status]}
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
