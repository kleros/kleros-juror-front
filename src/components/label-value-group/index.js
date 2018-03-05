import React from 'react'
import PropTypes from 'prop-types'

import Identicon from '../identicon'

import './label-value-group.css'

const LabelValueGroup = ({ items }) => (
  <div className="LabelValueGroup">
    {items.map(item => (
      <div key={item.label} className="LabelValueGroup-item">
        <div className="LabelValueGroup-item-column">
          <p className="LabelValueGroup-item-column-text">
            <small>{item.label}:</small>
          </p>
        </div>
        <div className="LabelValueGroup-item-column">
          {item.identiconSeed && (
            <Identicon
              seed={item.identiconSeed}
              size={6}
              className="LabelValueGroup-item-column-identicon"
            />
          )}
          <p className="LabelValueGroup-item-column-text">{item.value}</p>
        </div>
      </div>
    ))}
  </div>
)

LabelValueGroup.propTypes = {
  // State
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.element
      ]).isRequired,
      identiconSeed: PropTypes.string
    }).isRequired
  ).isRequired
}

export default LabelValueGroup
