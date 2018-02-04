import React from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'

import './identicon.css'

const Identicon = ({ size, scale, ...rest }) => (
  <div className="Identicon" style={{ height: `${size * scale}px` }}>
    <Blockies {...rest} size={size} scale={scale} />
  </div>
)

Identicon.propTypes = {
  // React Blockies
  size: PropTypes.number,
  scale: PropTypes.number,
  ...Blockies.propTypes
}

Identicon.defaultProps = {
  size: 15,
  scale: 4
}

export default Identicon
