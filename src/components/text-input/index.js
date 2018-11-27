import React from 'react'
import PropTypes from 'prop-types'

import './text-input.css'

const TextInput = ({
  input: { value, onChange },
  meta: { touched, valid, error, pristine },
  placeholder,
  type,
  className
}) => (
  <div
    className={`TextInput ${
      pristine ? 'is-pristine' : error ? 'is-error' : valid ? 'is-valid' : ''
    } ${className}`}
  >
    <input
      type={type}
      className="TextInput-input"
      value={value}
      onChange={onChange}
    />
    {placeholder && (
      <div
        className={`TextInput-placeholder${
          touched || (value !== null && value !== undefined)
            ? ' is-touched'
            : ''
        }`}
      >
        {placeholder}
      </div>
    )}
    {!pristine && error && <div className="TextInput-error">{error}</div>}
  </div>
)

TextInput.propTypes = {
  // Redux Form
  input: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired
  }).isRequired,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    valid: PropTypes.bool,
    error: PropTypes.string,
    pristine: PropTypes.bool
  }),

  // State
  placeholder: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,

  // Modifiers
  type: PropTypes.string,
  className: PropTypes.string
}

TextInput.defaultProps = {
  // Redux Form
  meta: {},

  // Modifiers
  type: 'text',
  className: ''
}

export default TextInput
