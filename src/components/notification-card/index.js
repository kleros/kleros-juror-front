import React from 'react'
import PropTypes from 'prop-types'

import './notification-card.css'

const NotificationCard = ({ message, onClick, onDismissClick }) => (
  <div className="NotificationCard">
    <div className="NotificationCard-message" onClick={onClick}>
      {message}
    </div>
    <div className="NotificationCard-dismiss" onClick={onDismissClick}>
      x
    </div>
  </div>
)

NotificationCard.propTypes = {
  // State
  message: PropTypes.string.isRequired,

  // Handlers
  onClick: PropTypes.func.isRequired,
  onDismissClick: PropTypes.func.isRequired
}

export default NotificationCard
