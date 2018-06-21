import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { connect } from '../../bootstrap/configure-store'
import * as contractSelectors from '../../reducers/contract'
import * as contractActions from '../../../actions/contract'
import ChainTable from '../../components/chain-table'
import Address from '../../components/address'
import TogglableIcon from '../../components/togglable-icon'
import ExploreInEtherscan from '../../components/explore-in-etherscan'
import ColorPicker from '../../components/color-picker'

class DataProvenance extends PureComponent {
  static propTypes = {
    // Redux State
    contracts: PropTypes.arrayOf(contractSelectors.contractShape.isRequired)
      .isRequired,

    // Action Dispatchers
    setContractVisibility: PropTypes.func.isRequired,
    setContractColor: PropTypes.func.isRequired
  }

  handleToggleVisibilityClick = ({
    currentTarget: { id, dataset: { value } }
  }) => {
    const { setContractVisibility } = this.props
    setContractVisibility(id, value !== 'true', true)
  }

  handleSelectColor = (id, color) => {
    const { setContractColor } = this.props
    setContractColor(id, color.hex)
  }

  render() {
    const { contracts } = this.props

    return (
      <div className="DataProvenance">
        <ChainTable
          columns={[
            {
              name: 'Contract',
              Component: Address
            },
            {
              name: 'Set Visibility',
              Component: ({ value: { address, visibleDataProvenance } }) => (
                <TogglableIcon
                  id={address}
                  on="eye"
                  off="eye-slash"
                  value={visibleDataProvenance}
                  onClick={this.handleToggleVisibilityClick}
                />
              )
            },
            {
              name: 'Explore in Etherscan',
              accessor: 'address',
              Component: ExploreInEtherscan
            },
            {
              name: 'Set Color',
              Component: ({ value: { address, color } }) => (
                <ColorPicker
                  id={address}
                  value={color}
                  onSelect={this.handleSelectColor}
                />
              )
            }
          ]}
          data={contracts}
        />
      </div>
    )
  }
}

export default connect(
  state => ({
    contracts: contractSelectors.getContracts(state)
  }),
  {
    setContractVisibility: contractActions.setContractVisibility,
    setContractColor: contractActions.setContractColor
  }
)(DataProvenance)
