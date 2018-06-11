import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { network } from '../../chain-view/bootstrap/dapp-api'
import etherscanLogo from '../../chain-view/assets/images/etherscan-logo.png'

import './chain-hash.css'

export default class ChainHash extends PureComponent {
  static propTypes = {
    // State
    children: PropTypes.string.isRequired,

    // Modifiers
    full: PropTypes.bool
  }

  static defaultProps = {
    // Modifiers
    full: false
  }

  state = { network: undefined }

  async componentDidMount() {
    this.setState({ network: await network })
  }

  render() {
    const { children, full } = this.props
    const { network } = this.state
    return (
      <span data-tip={children} className="ChainHash">
        {full
          ? children
          : children.slice(0, 6) + '...' + children.slice(children.length - 4)}
        <a
          href={`https://${
            network && network !== 'main' ? `${network}.` : ''
          }etherscan.io/address/${children}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ChainHash-link"
        >
          <img
            src={etherscanLogo}
            alt="Etherscan Logo"
            className="ChainHash-link-image"
          />
        </a>
      </span>
    )
  }
}
