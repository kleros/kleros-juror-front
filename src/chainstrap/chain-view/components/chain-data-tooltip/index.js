import React from 'react'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import * as tooltipSelectors from '../../reducers/tooltip'
import { objMap } from '../../../utils/functional'

import './chain-data-tooltip.css'

const ChainDataTooltip = ({
  data: {
    contractName,
    contractAddress,
    functionSignature,
    parameters,
    estimatedGas
  },
  onOpenChainViewClick
}) => (
  <div className="ChainDataTooltip">
    <h5 className="ChainDataTooltip-contractName">{contractName}</h5>
    <div className="ChainDataTooltip-label">
      <b>Address:</b> {contractAddress}
    </div>
    {functionSignature && (
      <div className="ChainDataTooltip-label">
        <b>Function:</b> {functionSignature}
      </div>
    )}
    {parameters && (
      <div className="ChainDataTooltip-label">
        <b>Parameters:</b>{' '}
        {objMap(parameters, (val, key) => (
          <div key={key} className="ChainDataTooltip-label-parameter">
            {key} = {val}
          </div>
        ))}
      </div>
    )}
    {estimatedGas && (
      <div className="ChainDataTooltip-label">
        <b>Estimated Gas:</b> {estimatedGas}
      </div>
    )}
    <div className="ChainDataTooltip-buttons">
      <a
        href={`https://etherscan.io/address/${contractAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="ChainDataTooltip-buttons-button"
      >
        <div className="ChainDataTooltip-buttons-button-icon">
          <FontAwesomeIcon icon="search" />
        </div>
        <div>
          EXPLORE IN<br />ETHERSCAN
        </div>
      </a>
      <CopyToClipboard text={contractAddress}>
        <div className="ChainDataTooltip-buttons-button">
          <div className="ChainDataTooltip-buttons-button-icon">
            <FontAwesomeIcon icon="copy" />
          </div>
          <div>
            COPY<br />ADDRESS
          </div>
        </div>
      </CopyToClipboard>
      <div
        onClick={onOpenChainViewClick}
        className="ChainDataTooltip-buttons-button"
      >
        <div>
          OPEN IN<br />CHAINVIEW
        </div>
      </div>
    </div>
  </div>
)

ChainDataTooltip.propTypes = {
  // State
  data: tooltipSelectors.chainDataShape.isRequired,

  // Callbacks
  onOpenChainViewClick: PropTypes.func.isRequired
}

export default ChainDataTooltip
