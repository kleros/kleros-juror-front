import React, { Component } from 'react'
import { ArbitrablePermissionList } from 'kleros-api/lib/contracts/implementations/arbitrable'

import { eth, env } from '../../../bootstrap/dapp-api'
import LinkBox from '../../link-box'

import './doges-on-trial-evidence.css'

class DogesOnTrialEvidence extends Component {
  state = {
    evidence: null
  }

  componentDidMount() {
    window.onmessage = this.receiveEvidence.bind(this)
    window.parent.postMessage(
      {
        target: 'evidence',
        loaded: true
      },
      '*'
    )
  }

  async receiveEvidence(message) {
    if (message.data && message.data.target === 'evidence') {
      const arbitrablePermissionList = new ArbitrablePermissionList(
        eth.currentProvider,
        message.data.arbitrableContractAddress
      )

      const itemHash = await arbitrablePermissionList.getItemByDisputeId(
        message.data.disputeID
      )
      message.data.metaEvidence.fileURI =
        process.env[`REACT_APP_${env}_DOGE_IMAGES_BASE_URL`] + itemHash

      this.setState({
        evidence: message.data
      })
    }
  }

  render() {
    const { evidence } = this.state
    if (!evidence) return null

    const uri = evidence.metaEvidence.fileURI

    return (
      <div className="DogesOnTrialEvidence">
        <h4>The Doge in Question:</h4>
        <div className="DogesOnTrialEvidence-picture">
          <a
            className="DogesOnTrialEvidence-picture-link"
            href={ uri }
            target="_blank"
          >
            <LinkBox link={ uri } />
          </a>
        </div>
      </div>
    )
  }
}

export default DogesOnTrialEvidence
