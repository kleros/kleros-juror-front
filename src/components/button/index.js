import React from 'react'
import PropTypes from 'prop-types'

import './button.css'

const Button = ({ children, onClick, disabled, className }) => (
  <div
    className={`Button ${disabled ? 'is-disabled' : ''} ${className}`}
    onClick={onClick}
  >
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
  disabled: PropTypes.bool,
  className: PropTypes.string
}

Button.defaultProps = {
  // Modifiers
  disabled: false,
  className: ''
}

export default Button
