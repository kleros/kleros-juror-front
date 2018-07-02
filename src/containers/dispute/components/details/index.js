import React from 'react'
import PropTypes from 'prop-types'

import { ChainData } from '../../../../chainstrap'
import { ARBITRATOR_ADDRESS } from '../../../../bootstrap/dapp-api'
import { dateToString } from '../../../../utils/date'
import LabelValueGroup from '../../../../components/label-value-group'
import TruncatedTextBox from '../../../../components/truncated-text-box'
import * as chainViewConstants from '../../../../constants/chain-view'

import './details.css'

const Details = ({
  date,
  partyAAddress,
  partyBAddress,
  arbitrationFee,
  arbitrableContractAddress,
  disputeID,
  appealNumber,
  description
}) => (
  <div className="Details">
    <small>
      {dateToString(date, { withTime: false, numericMonth: false })}
    </small>
    <h4>{appealNumber ? `Appeal #${appealNumber}` : 'Dispute'} Details</h4>
    <LabelValueGroup
      items={[
        {
          label: 'Party A',
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
          label: 'Party B',
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
    <div>
      <h4>Contract Description</h4>
      <TruncatedTextBox text={description} numberOfWords={200} />
    </div>
    <hr />
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
  description: PropTypes.string.isRequired
}

export default Details
