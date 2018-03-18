import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './notification-card.css'

const NotificationCard = ({ id, message, to, onClick, onDismissClick }) => {
  const content = (
    <div className="NotificationCard-message" onClick={onClick}>
      {message}
    </div>
  )
  return (
    <div className="NotificationCard">
      {to ? <Link to={to}>{content}</Link> : content}
      <div
        id={id}
        className="NotificationCard-dismiss"
        onClick={onDismissClick}
      >
        x
      </div>
    </div>
  )
}

NotificationCard.propTypes = {
  // State
  id: PropTypes.string,
  message: PropTypes.string.isRequired,
  to: PropTypes.string,

  // Handlers
  onClick: PropTypes.func,
  onDismissClick: PropTypes.func
}

NotificationCard.defaultProps = {
  // State
  id: '',
  to: null,

  // Handlers
  onClick: null,
  onDismissClick: null
}

export default NotificationCard
