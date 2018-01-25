import React from 'react'
import PropTypes from 'prop-types'

import './button.css'

const Button = ({ children, onClick, className }) => (
  <div className={`Button ${className}`} onClick={onClick}>
    <h5 className="Button-label">{children}</h5>
  </div>
)

Button.propTypes = {
  // State
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,

  // Handlers
  onClick: PropTypes.func.isRequired,

  // Modifiers
  className: PropTypes.string
}

Button.defaultProps = {
  // Modifiers
  className: ''
}

export default Button
