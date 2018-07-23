import React from 'react'
import PropTypes from 'prop-types'

import { ChainData } from '../../../../chainstrap'
import { ARBITRATOR_ADDRESS } from '../../../../bootstrap/dapp-api'
import { dateToString } from '../../../../utils/date'
import LabelValueGroup from '../../../../components/label-value-group'
import TruncatableTextBox from '../../../../components/truncatable-text-box'
import * as chainViewConstants from '../../../../constants/chain-view'
import LinkBox from '../../../../components/link-box'

import './details.css'

const Details = ({
  date,
  partyAAddress,
  partyBAddress,
  arbitrationFee,
  arbitrableContractAddress,
  disputeID,
  appealNumber,
  metaEvidence
}) => (
  <div className="Details">
    <small>
      {dateToString(date, { withTime: false, numericMonth: false })}
    </small>
    <h4>{appealNumber ? `Appeal #${appealNumber}` : 'Dispute'} Details</h4>
    <LabelValueGroup
      items={[
        {
          label: metaEvidence.aliases[partyAAddress] || 'Party A  ',
          value: (
            <ChainData
              contractName={chainViewConstants.ARBITRABLE_CONTRACT_NAME}
              contractAddress={arbitrableContractAddress}
              functionSignature={
                chainViewConstants.ARBITRABLE_CONTRACT_PARTY_A_SIG
              }
              parameters={chainViewConstants.ARBITRABLE_CONTRACT_PARTY_A_PARAMS()}
            >
              {partyAAddress}
            </ChainData>
          ),
          identiconSeed: partyAAddress
        },
        {
          label: metaEvidence.aliases[partyBAddress] || 'Party B',
          value: (
            <ChainData
              contractName={chainViewConstants.ARBITRABLE_CONTRACT_NAME}
              contractAddress={arbitrableContractAddress}
              functionSignature={
                chainViewConstants.ARBITRABLE_CONTRACT_PARTY_B_SIG
              }
              parameters={chainViewConstants.ARBITRABLE_CONTRACT_PARTY_B_PARAMS()}
            >
              {partyBAddress}
            </ChainData>
          ),
          identiconSeed: partyBAddress
        },
        {
          label: 'Dispute Category',
          value: (
            <ChainData
              contractName={chainViewConstants.KLEROS_POC_NAME}
              contractAddress={ARBITRATOR_ADDRESS}
              functionSignature={chainViewConstants.KLEROS_POC_DISPUTES_SIG}
              parameters={chainViewConstants.KLEROS_POC_DISPUTES_PARAMS(
                disputeID
              )}
            >
              {metaEvidence.category}
            </ChainData>
          )
        },
        {
          label: 'Arbitration Fee',
          value: (
            <ChainData
              contractName={chainViewConstants.KLEROS_POC_NAME}
              contractAddress={ARBITRATOR_ADDRESS}
              functionSignature={chainViewConstants.KLEROS_POC_DISPUTES_SIG}
              parameters={chainViewConstants.KLEROS_POC_DISPUTES_PARAMS(
                disputeID
              )}
            >{`${arbitrationFee} ETH`}</ChainData>
          )
        }
      ]}
    />
    <hr />
    {metaEvidence.description && (
      <div>
        <h4>Description</h4>
        <TruncatableTextBox text={metaEvidence.description} maxWords={200} />
        <hr />
      </div>
    )}
    {metaEvidence.fileURI && (
      <div>
        <h4>File</h4>
        <LinkBox link={metaEvidence.fileURI} />
        <hr />
      </div>
    )}
  </div>
)

Details.propTypes = {
  // State
  date: PropTypes.instanceOf(Date).isRequired,
  partyAAddress: PropTypes.string.isRequired,
  partyBAddress: PropTypes.string.isRequired,
  arbitrationFee: PropTypes.number.isRequired,
  arbitrableContractAddress: PropTypes.string.isRequired,
  disputeID: PropTypes.number.isRequired,
  appealNumber: PropTypes.number.isRequired,
  metaEvidence: PropTypes.shape()
}

Details.defaultProps = {
  // State
  metaEvidence: {}
}

export default Details
