import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ARBITRATOR_ADDRESS } from '../../../../bootstrap/dapp-api'
import { dateToString } from '../../../../utils/date'
import LabelValueGroup from '../../../../components/label-value-group'

class Evidence extends Component {
  componentDidMount() {
    window.addEventListener('message', this.handleFrameMessage.bind(this))
  }

  handleFrameMessage = message => {
    if (
      message.data &&
      message.data.target === 'evidence' &&
      message.data.loaded
    ) {
      const {
        evidenceJSON,
        metaEvidenceJSON,
        arbitrableContractAddress,
        disputeID
      } = this.props

      message.source.postMessage(
        {
          target: 'evidence',
          metaEvidence: metaEvidenceJSON,
          evidence: evidenceJSON,
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
      evidenceJSON,
      submittedBy,
      submittedAt,
      metaEvidenceJSON
    } = this.props

    let fileDisplay = <div />

    // Use external interface to display primary document file.
    if (metaEvidenceJSON.evidenceDisplayInterfaceURL)
      fileDisplay = (
        <iframe
          title="Evidence Display"
          src={metaEvidenceJSON.evidenceDisplayInterfaceURL}
          frameBorder="0"
          height="300"
        />
      )

    return (
      <div className="Evidence">
        <small>{dateToString(submittedAt, { withTime: false })}</small>
        <h4>Evidence Submitted</h4>
        <LabelValueGroup
          items={[
            {
              label: 'Submitted By',
              value: submittedBy,
              identiconSeed: submittedBy
            },
            { label: 'Name', value: evidenceJSON.name },
            { label: 'Description', value: evidenceJSON.description },
            {
              label: 'File',
              value: <a href={evidenceJSON.url}>{evidenceJSON.url}</a>
            }
          ]}
        />
        <hr />
        {fileDisplay}
      </div>
    )
  }
}

Evidence.propTypes = {
  // State
  evidenceJSON: PropTypes.shape().isRequired,
  submittedBy: PropTypes.string.isRequired,
  submittedAt: PropTypes.instanceOf(Date).isRequired,
  metaEvidenceJSON: PropTypes.shape().isRequired,
  arbitrableContractAddress: PropTypes.string.isRequired,
  disputeID: PropTypes.number.isRequired
}

export default Evidence
