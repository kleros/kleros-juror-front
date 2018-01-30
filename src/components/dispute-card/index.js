import React from 'react'
import PropTypes from 'prop-types'

import { formatDateString } from '../../utils/date'
import { STATUS_ENUM } from '../../constants/dispute'

import './dispute-card.css'

const DisputeCard = ({ status, subcourt, date, title, className }) => (
  <div className="DisputeCard">
    <div
      className={`DisputeCard-status ${`DisputeCard-status--${
        STATUS_ENUM[status]
      }`} ${className}`}
      data-tip={STATUS_ENUM[status]}
      data-type="info"
    />
    <h6>
      {subcourt}
      <small>
        <span className="DisputeCard-oval" />
        {formatDateString(date)}
      </small>
    </h6>
    <h5>
      <a>{title}</a>
    </h5>
  </div>
)

DisputeCard.propTypes = {
  // State
  status: PropTypes.number.isRequired,
  subcourt: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  title: PropTypes.string.isRequired,

  // Modifiers
  className: PropTypes.string
}

DisputeCard.defaultProps = {
  // Modifiers
  className: ''
}

export default DisputeCard
