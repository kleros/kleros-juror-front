import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const ExploreInEtherscan = ({ value }) => (
  <a
    href={`https://etherscan.io/address/${value}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <FontAwesomeIcon icon="search" />
  </a>
)

ExploreInEtherscan.propTypes = {
  // State
  value: PropTypes.string.isRequired
}

export default ExploreInEtherscan
