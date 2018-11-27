import React from 'react'
import PropTypes from 'prop-types'

import './form-info.css'

const FormInfo = ({ input: { value }, className }) => (
  <div className={`FormInfo${className ? ' ' + className : ''}`}>
    <h5 className="FormInfo-text">{value}</h5>
  </div>
)

FormInfo.propTypes = {
  // Redux Form
  input: PropTypes.shape({ value: PropTypes.node.isRequired }).isRequired,
  className: PropTypes.string
}

FormInfo.defaultProps = {
  className: ''
}

export default FormInfo
