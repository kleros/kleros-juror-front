import React from 'react'
import PropTypes from 'prop-types'

import './form-info.css'

const FormInfo = ({ input: { value } }) => (
  <div className="FormInfo">
    <h5 className="FormInfo-text">{value}</h5>
  </div>
)

FormInfo.propTypes = {
  input: PropTypes.shape({ value: PropTypes.string.isRequired }).isRequired
}

export default FormInfo
