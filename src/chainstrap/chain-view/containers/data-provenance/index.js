import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import ChainViewTable from '../../components/chain-view-table'
import Address from '../../components/address'
import TogglableIcon from '../../components/togglable-icon'
import ExploreInEtherscan from '../../components/explore-in-etherscan'
import ColorPicker from '../../components/color-picker'

import './data-provenance.css'

class DataProvenance extends PureComponent {
  state = {}
  render() {
    return (
      <div className="DataProvenance">
        <ChainViewTable
          columns={[
            {
              name: 'Contract',
              Component: Address
            },
            {
              name: 'Set Visibility',
              accessor: 'visible',
              Component: ({ value }) => (
                <TogglableIcon
                  on="eye"
                  off="eye-slash"
                  value={value}
                  onClick={() => console.log('adwdw')}
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
              accessor: 'color',
              Component: ({ value }) => (
                <ColorPicker
                  value={value}
                  onSelect={color => console.log(color)}
                />
              )
            }
          ]}
          data={[
            {
              name: 'Arbitrator',
              address: '0xfff',
              visible: false,
              color: '#ededed'
            }
          ]}
        />
      </div>
    )
  }
}

export default connect()(DataProvenance)
