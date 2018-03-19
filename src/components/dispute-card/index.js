import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { dateToString } from '../../utils/date'
import StatusHint from '../status-hint'

import './dispute-card.css'

const DisputeCard = ({
  status,
  subcourt,
  disputeID,
  date,
  title,
  className
}) => (
  <div className={`DisputeCard ${className}`}>
    <StatusHint status={status} className="DisputeCard-status" />
    <h6>
      {subcourt}
      <small>
        <span className="DisputeCard-oval" />
        {dateToString(date, { withYear: false })}
      </small>
    </h6>
    <h5>
      <Link to={`/disputes/${disputeID}`}>
        {title}
        {disputeID ? ` #${disputeID}` : ''}
      </Link>
    </h5>
  </div>
)

DisputeCard.propTypes = {
  // State
  status: PropTypes.number.isRequired,
  subcourt: PropTypes.string.isRequired,
  disputeID: PropTypes.string.isRequired,
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
