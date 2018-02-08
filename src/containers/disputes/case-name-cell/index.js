import React from 'react'
import PropTypes from 'prop-types'

import Identicon from '../../../components/identicon'

import './case-name-cell.css'

const CaseNameCell = ({
  original: { disputeId, arbitrableContractAddress, description }
}) => (
  <div className="CaseNameCell">
    <Identicon seed={arbitrableContractAddress} size={12} />
    <div className="CaseNameCell-title">
      <h5>{description}</h5>
      <small>#{disputeId}</small>
    </div>
  </div>
)

CaseNameCell.propTypes = {
  original: PropTypes.shape({
    disputeId: PropTypes.string.isRequired,
    arbitrableContractAddress: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired
}

export default CaseNameCell
