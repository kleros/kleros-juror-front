import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { ChainData } from '../../../../chainstrap'
import { arbitratorAddress } from '../../../../bootstrap/dapp-api'
import Identicon from '../../../../components/identicon'
import * as chainViewConstants from '../../../../constants/chain-view'

import './case-name-cell.css'

const CaseNameCell = ({
  original: { disputeId, arbitrableContractAddress, description }
}) => (
  <div className="CaseNameCell">
    <Identicon seed={arbitrableContractAddress} size={12} />
    <Link to={`/disputes/${disputeId}`}>
      <div className="CaseNameCell-title">
        <h5>{description}</h5>
        <small>
          <ChainData
            contractName={chainViewConstants.KLEROS_POC_NAME}
            contractAddress={arbitratorAddress}
            functionSignature={chainViewConstants.KLEROS_POC_DISPUTES_SIG}
            parameters={chainViewConstants.KLEROS_POC_DISPUTES_PARAMS(
              disputeId
            )}
            style={{ display: 'block', height: '100%', width: '100%' }}
          >
            #{disputeId}
          </ChainData>
        </small>
      </div>
    </Link>
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
