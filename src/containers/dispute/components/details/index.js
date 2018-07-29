import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ChainData } from '../../../../chainstrap'
import { ARBITRATOR_ADDRESS } from '../../../../bootstrap/dapp-api'
import { dateToString } from '../../../../utils/date'
import LabelValueGroup from '../../../../components/label-value-group'
import TruncatableTextBox from '../../../../components/truncatable-text-box'
import * as chainViewConstants from '../../../../constants/chain-view'
import LinkBox from '../../../../components/link-box'

import './details.css'

class Details extends Component {
  componentDidMount() {
    if (this.metaEvidenceFrame) {
      const { metaEvidence, disputeID, arbitrableContractAddress } = this.props

      this.metaEvidenceFrame.onload = () => {
        this.metaEvidenceFrame.contentWindow.postMessage(
          {
            target: 'evidence',
            data: { metaEvidence, disputeID, arbitrableContractAddress }
          },
          '*'
        )
      }
    }
  }

  registerMetaEvidenceFrame = frame => {
    this.metaEvidenceFrame = frame
  }

  render() {
    const {
      date,
      arbitrationFee,
      arbitrableContractAddress,
      disputeID,
      appealNumber,
      metaEvidence
    } = this.props

    let fileDisplay = (
      <div>
        <h4>File</h4>
        <LinkBox link={metaEvidence.fileURI} />
      </div>
    )

    if (metaEvidence.evidenceDisplayInterfaceURL) {
      fileDisplay = (
        <iframe
          title="File Display"
          src={metaEvidence.evidenceDisplayInterfaceURL}
          ref={this.registerMetaEvidenceFrame}
          frameBorder="0"
          height="300"
        />
      )
    }

    return (
      <div className="Details">
        <small>
          {dateToString(date, { withTime: false, numericMonth: false })}
        </small>
        <h4>{appealNumber ? `Appeal #${appealNumber}` : 'Dispute'} Details</h4>
        <LabelValueGroup
          items={Object.keys(metaEvidence.aliases)
            .map(address => ({
              label: metaEvidence.aliases[address],
              value: (
                <ChainData
                  contractName={chainViewConstants.ARBITRABLE_CONTRACT_NAME}
                  contractAddress={arbitrableContractAddress}
                  functionSignature={
                    chainViewConstants.ARBITRABLE_CONTRACT_PARTY_A_SIG
                  }
                  parameters={chainViewConstants.ARBITRABLE_CONTRACT_PARTY_A_PARAMS()}
                >
                  {address}
                </ChainData>
              ),
              identiconSeed: address
            }))
            .concat([
              {
                label: 'Dispute Category',
                value: (
                  <ChainData
                    contractName={chainViewConstants.KLEROS_POC_NAME}
                    contractAddress={ARBITRATOR_ADDRESS}
                    functionSignature={
                      chainViewConstants.KLEROS_POC_DISPUTES_SIG
                    }
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
                    functionSignature={
                      chainViewConstants.KLEROS_POC_DISPUTES_SIG
                    }
                    parameters={chainViewConstants.KLEROS_POC_DISPUTES_PARAMS(
                      disputeID
                    )}
                  >{`${arbitrationFee} ETH`}</ChainData>
                )
              }
            ])}
        />
        <hr />
        {metaEvidence.description && (
          <div>
            <h4>Description</h4>
            <TruncatableTextBox
              text={metaEvidence.description}
              maxWords={200}
            />
            <hr />
          </div>
        )}
        {fileDisplay}
      </div>
    )
  }
}

Details.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
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
