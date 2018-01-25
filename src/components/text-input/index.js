import React from 'react'
import PropTypes from 'prop-types'

import './text-input.css'

const TextInput = ({
  placeholder,
  input: { value, onChange },
  meta: { valid, touched, error },
  className
}) => (
  <div
    className={`TextInput ${
      error ? 'is-error' : valid ? 'is-valid' : ''
    } ${className}`}
  >
    <input
      className="TextInput-input"
      type="text"
      value={value}
      onChange={onChange}
    />
    {placeholder && (
      <div
        className={`TextInput-placeholder${
          touched || value ? ' is-touched' : ''
        }`}
      >
        {placeholder}
      </div>
    )}
    {error && <div className="TextInput-error">{error}</div>}
  </div>
)

TextInput.propTypes = {
  // State
  placeholder: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,

  // Redux Form
  input: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired
  }).isRequired,
  meta: PropTypes.shape({
    valid: PropTypes.bool,
    touched: PropTypes.bool,
    error: PropTypes.string
  }).isRequired,

  // Modifiers
  className: PropTypes.string
}

TextInput.defaultProps = {
  // Modifiers
  className: ''
}

export default TextInput
