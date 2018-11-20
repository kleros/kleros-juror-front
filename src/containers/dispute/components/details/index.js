import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ARBITRATOR_ADDRESS } from '../../../../bootstrap/dapp-api'
import { dateToString } from '../../../../utils/date'
import { weiBNToDecimalString } from '../../../../utils/number'
import LabelValueGroup from '../../../../components/label-value-group'
import TruncatableTextBox from '../../../../components/truncatable-text-box'
import LinkBox from '../../../../components/link-box'

import './details.css'

class Details extends Component {
  componentDidMount() {
    // eslint-disable-next-line unicorn/prefer-add-event-listener
    window.onmessage = this.handleFrameMessage.bind(this)
  }

  handleFrameMessage = message => {
    if (
      message.data &&
      message.data.target === 'evidence' &&
      message.data.loaded
    ) {
      const {
        metaEvidenceJSON,
        disputeID,
        arbitrableContractAddress
      } = this.props

      message.source.postMessage(
        {
          target: 'evidence',
          metaEvidence: metaEvidenceJSON,
          evidence: null,
          arbitrableContractAddress,
          arbitratorAddress: ARBITRATOR_ADDRESS,
          disputeID
        },
        '*'
      )
    }
  }

  render() {
    const {
      createdAt,
      arbitrationFee,
      appealNumber,
      metaEvidenceJSON
    } = this.props

    // Default display of primary document file.
    let fileDisplay = metaEvidenceJSON.fileURI ? (
      <div>
        <h4>File</h4>
        <LinkBox link={metaEvidenceJSON.fileURI} />
      </div>
    ) : (
      <div />
    )

    // Use external interface to display primary document file.
    if (metaEvidenceJSON.evidenceDisplayInterfaceURL)
      fileDisplay = (
        <iframe
          title="File Display"
          src={metaEvidenceJSON.evidenceDisplayInterfaceURL}
          frameBorder="0"
          height="300"
        />
      )

    return (
      <div className="Details">
        <small>{dateToString(createdAt, { withTime: false })}</small>
        <h4>{appealNumber ? `Appeal #${appealNumber}` : 'Dispute'} Details</h4>
        <LabelValueGroup
          items={Object.keys(metaEvidenceJSON.aliases)
            .map(address => ({
              label: metaEvidenceJSON.aliases[address],
              value: address
              // identiconSeed: address
            }))
            .concat([
              {
                label: 'Dispute Category',
                value: metaEvidenceJSON.category
              },
              {
                label: 'Arbitration Fee',
                value: `${weiBNToDecimalString(arbitrationFee)} ETH`
              }
            ])}
        />
        <hr />
        {metaEvidenceJSON.description && (
          <div>
            <h4>Description</h4>
            <TruncatableTextBox
              text={metaEvidenceJSON.description}
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
  createdAt: PropTypes.instanceOf(Date).isRequired,
  arbitrationFee: PropTypes.number.isRequired,
  arbitrableContractAddress: PropTypes.string.isRequired,
  disputeID: PropTypes.number.isRequired,
  appealNumber: PropTypes.number.isRequired,
  metaEvidenceJSON: PropTypes.shape()
}

Details.defaultProps = {
  // State
  metaEvidenceJSON: {}
}

export default Details
