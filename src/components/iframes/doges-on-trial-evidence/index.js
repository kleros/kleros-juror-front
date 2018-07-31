import React, { Component } from 'react'
import { ArbitrablePermissionList } from 'kleros-api/lib/contracts/implementations/arbitrable'

import { eth } from '../../../bootstrap/dapp-api'
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

  async receiveEvidence(evidence) {
    if (evidence.data && evidence.data.target === 'evidence') {
      const arbitrablePermissionList = new ArbitrablePermissionList(
        eth.currentProvider,
        evidence.data.data.arbitrableContractAddress
      )

      const itemHash = await arbitrablePermissionList.getItemByDisputeId(
        evidence.data.data.disputeID
      )
      evidence.data.data.metaEvidence.fileURI =
        process.env.REACT_APP_DEV_DOGE_IMAGES_BASE_URL + itemHash

      this.setState({
        evidence: evidence.data.data
      })
    }
  }

  render() {
    const { evidence } = this.state
    if (!evidence) return null
    let uri
    // it is metaEvidence if there is a disputeID. We have to fetch the image
    if (evidence.disputeID !== null && evidence.disputeID !== undefined) {
      uri = evidence.metaEvidence.fileURI
    } else uri = evidence.URI

    return (
      <div className="DogesOnTrialEvidence">
        <h4>The Doge in Question:</h4>
        <div className="DogesOnTrialEvidence-picture">
          <LinkBox link={uri} />
        </div>
      </div>
    )
  }
}

export default DogesOnTrialEvidence
