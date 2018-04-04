import React from 'react'
import PropTypes from 'prop-types'
import Blockies from 'react-blockies'

import ShortHash from '../../../components/short-hash'

import './address.css'

const Address = ({ value: { name, address } }) => (
  <div className="Address">
    <Blockies seed={address} size={6} />
    <div className="Address-text">
      <div className="Address-text-name">{name}</div>
      <div className="Address-text-address">
        <ShortHash hash={address} />
      </div>
    </div>
  </div>
)

Address.propTypes = {
  // State
  value: PropTypes.shape({
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }).isRequired
}

export default Address
