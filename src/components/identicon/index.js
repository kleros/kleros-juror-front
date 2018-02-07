import React from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'

import './identicon.css'

const Identicon = ({ seed, size, scale, ...rest }) => {
  const length = `${size * scale}px`
  return (
    <div className="Identicon" style={{ height: length, width: length }}>
      <a href={`https://etherscan.io/address/${seed}`} target="_blank">
        <Blockies {...rest} seed={seed} size={size} scale={scale} />
      </a>
    </div>
  )
}

Identicon.propTypes = {
  // React Blockies
  seed: PropTypes.number.isRequired,
  size: PropTypes.number,
  scale: PropTypes.number,
  ...Blockies.propTypes
}

Identicon.defaultProps = {
  size: 15,
  scale: 4
}

export default Identicon
