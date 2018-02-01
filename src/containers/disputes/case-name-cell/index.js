import React from 'react'
import PropTypes from 'prop-types'

import Identicon from '../../../components/identicon'

import './case-name-cell.css'

const CaseNameCell = ({
  original: { arbitrableContractAddress, arbitrableContractTitle }
}) => (
  <div className="CaseNameCell">
    <Identicon size={12} seed={arbitrableContractAddress} />
    <div className="CaseNameCell-title">
      <h5>{arbitrableContractTitle}</h5>
      <small>Unknown subcourt</small>
    </div>
  </div>
)

CaseNameCell.propTypes = {
  original: PropTypes.shape({
    arbitrableContractAddress: PropTypes.string.isRequired,
    arbitrableContractTitle: PropTypes.string.isRequired
  }).isRequired
}

export default CaseNameCell
