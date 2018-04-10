import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from '../chain-view/bootstrap/configure-store'
import * as tooltipActions from '../actions/tooltip'

class ChainData extends PureComponent {
  static propTypes = {
    // Action Dispatchers
    setChainData: PropTypes.func.isRequired,

    // State
    children: PropTypes.node.isRequired,
    visible: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
    contractName: PropTypes.string.isRequired,
    contractAddress: PropTypes.string.isRequired,
    functionSignature: PropTypes.string,
    parameters: PropTypes.objectOf(PropTypes.string.isRequired)
  }

  static defaultProps = {
    // State
    functionSignature: null,
    parameters: null
  }

  handleMouseEnter = () => {
    const {
      setChainData,
      contractName,
      contractAddress,
      functionSignature,
      parameters
    } = this.props
    setChainData({
      contractName,
      contractAddress,
      functionSignature,
      parameters
    })
  }

  render() {
    const { children, visible, color } = this.props

    return visible ? (
      <span
        onMouseEnter={this.handleMouseEnter}
        data-tip=""
        data-for="chainViewChainData"
        style={{ color: color }}
      >
        {children}
      </span>
    ) : (
      children
    )
  }
}

export default connect(
  (state, ownProps) => ({
    visible: state.contract[ownProps.contractAddress].visible,
    color: state.contract[ownProps.contractAddress].color
  }),
  { setChainData: tooltipActions.setChainData }
)(ChainData)
