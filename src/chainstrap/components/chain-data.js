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
    visibleDataProvenance: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
    visibleTransactions: PropTypes.bool.isRequired,
    contractName: PropTypes.string.isRequired,
    contractAddress: PropTypes.string.isRequired,
    functionSignature: PropTypes.string,
    parameters: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
    ),
    estimatedGas: PropTypes.number,

    // Modifiers
    style: PropTypes.shape({})
  }

  static defaultProps = {
    // State
    functionSignature: null,
    parameters: null,
    estimatedGas: null,

    // Modifiers
    style: null
  }

  handleMouseEnter = () => {
    const {
      setChainData,
      contractName,
      contractAddress,
      functionSignature,
      parameters,
      estimatedGas
    } = this.props
    setChainData({
      contractName,
      contractAddress,
      functionSignature,
      parameters,
      estimatedGas
    })
  }

  render() {
    const {
      children,
      visibleDataProvenance,
      color,
      visibleTransactions,
      estimatedGas,
      style
    } = this.props

    return (estimatedGas ? (
      visibleTransactions
    ) : (
      visibleDataProvenance
    )) ? (
      <span
        onMouseEnter={this.handleMouseEnter}
        data-tip=""
        data-for="chainViewChainData"
        style={{ ...style, color: color }}
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
    visibleDataProvenance:
      state.contract[ownProps.contractAddress].visibleDataProvenance,
    color: state.contract[ownProps.contractAddress].color,
    visibleTransactions:
      state.contract[ownProps.contractAddress].visibleTransactions
  }),
  { setChainData: tooltipActions.setChainData }
)(ChainData)
