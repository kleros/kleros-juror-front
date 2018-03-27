import React from 'react'
import PropTypes from 'prop-types'

import './form-header.css'

const FormHeader = ({ title }) => (
  <div className="FormHeader">
    <h4>{title}</h4>
  </div>
)

FormHeader.propTypes = {
  // State
  title: PropTypes.string.isRequired
}

export default FormHeader
