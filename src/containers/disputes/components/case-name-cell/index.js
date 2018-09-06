import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { ChainData } from '../../../../chainstrap'
import { ARBITRATOR_ADDRESS } from '../../../../bootstrap/dapp-api'
import Identicon from '../../../../components/identicon'
import * as chainViewConstants from '../../../../constants/chain-view'

import './case-name-cell.css'

const CaseNameCell = ({
  original: { disputeID, arbitrableContractAddress, title }
}) => (
  <div className="CaseNameCell">
    <Identicon seed={arbitrableContractAddress} size={12} />
    <Link to={`/cases/${disputeID}`}>
      <div className="CaseNameCell-title">
        <h5>{title}</h5>
        <small>
          <ChainData
            contractName={chainViewConstants.KLEROS_POC_NAME}
            contractAddress={ARBITRATOR_ADDRESS}
            functionSignature={chainViewConstants.KLEROS_POC_DISPUTES_SIG}
            parameters={chainViewConstants.KLEROS_POC_DISPUTES_PARAMS(
              disputeID
            )}
            style={{ display: 'block', height: '100%', width: '100%' }}
          >
            Case #{disputeID}
          </ChainData>
        </small>
      </div>
    </Link>
  </div>
)

CaseNameCell.propTypes = {
  original: PropTypes.shape({
    disputeID: PropTypes.string.isRequired,
    arbitrableContractAddress: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired
}

export default CaseNameCell
