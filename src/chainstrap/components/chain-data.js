import React from 'react'
import PropTypes from 'prop-types'

import { connect } from '../chain-view/bootstrap/configure-store'

const ChainData = ({ children, visible, color }) =>
  visible ? <span style={{ color: color }}>{children}</span> : children

ChainData.propTypes = {
  // State
  children: PropTypes.node.isRequired,
  visible: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired
}

export default connect((state, ownProps) => ({
  visible: state.contract[ownProps.address].visible,
  color: state.contract[ownProps.address].color
}))(ChainData)
