import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import { objMap } from '../../../utils/functional'

import './chain-data-tooltip.css'

const ChainDataTooltip = ({
  data: { contractName, contractAddress, functionSignature, parameters }
}) => (
  <div className="ChainDataTooltip">
    <h5 className="ChainDataTooltip-contractName">{contractName}</h5>
    <div className="ChainDataTooltip-label">Address: {contractAddress}</div>
    <div className="ChainDataTooltip-label">Function: {functionSignature}</div>
    <div className="ChainDataTooltip-label">
      Parameters:{' '}
      {objMap(parameters, (val, key) => (
        <div className="ChainDataTooltip-label-parameter">
          {key} = {val}
        </div>
      ))}
    </div>
    <div className="ChainDataTooltip-buttons">
      <div className="ChainDataTooltip-buttons-button">
        <div className="ChainDataTooltip-buttons-button-icon">
          <FontAwesomeIcon icon="search" />
        </div>
        <div>
          EXPLORE IN<br />ETHERSCAN
        </div>
      </div>
      <div className="ChainDataTooltip-buttons-button">
        <div className="ChainDataTooltip-buttons-button-icon">
          <FontAwesomeIcon icon="copy" />
        </div>
        <div>
          COPY<br />ADDRESS
        </div>
      </div>
      <div className="ChainDataTooltip-buttons-button">
        <div>
          OPEN IN<br />CHAINVIEW
        </div>
      </div>
    </div>
  </div>
)

ChainDataTooltip.propTypes = {
  data: PropTypes.shape({
    contractName: PropTypes.string.isRequired,
    contractAddress: PropTypes.string.isRequired,
    functionSignature: PropTypes.string.isRequired,
    parameters: PropTypes.objectOf(PropTypes.string.isRequired).isRequired
  }).isRequired
}

export default ChainDataTooltip
