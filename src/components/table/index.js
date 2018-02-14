import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'

import { fuzzyObjSearch } from '../../utils/search'
import TextInput from '../text-input'

import './table.css'

class Table extends PureComponent {
  constructor(props) {
    super(props)
    const { data } = this.props
    this.state = {
      searchInput: '',
      filteredData: data || []
    }
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.props
    const { nextData } = nextProps
    if (data !== nextData) this.filterData(nextProps)
  }

  filterData = (props = this.props) => {
    const { data } = props
    const { searchInput } = this.state
    this.setState({
      filteredData: data
        ? data.filter(obj => fuzzyObjSearch(searchInput, obj))
        : []
    })
  }

  onSearchInputChange = event => {
    this.setState({ searchInput: event.currentTarget.value }, this.filterData)
  }

  getTrProps = () => {
    const { onRowClick } = this.props
    return {
      onClick: onRowClick
    }
  }

  render() {
    const { data: _data, className, ...rest } = this.props
    const { searchInput, filteredData } = this.state

    return (
      <div className={`Table ${className}`}>
        <div className="Table-searchBar">
          <TextInput
            input={{ value: searchInput, onChange: this.onSearchInputChange }}
            placeholder="SEARCH"
            className="Table-searchBar-searchInput"
          />
        </div>
        <ReactTable
          // Number of Rows
          minRows={filteredData.length || 3}
          pageSizeOptions={[7, 14, 28, 56, 112]}
          defaultPageSize={7}
          // Indicators
          loadingText="Loading..."
          noDataText="No data."
          // Row Props
          getTrProps={this.getTrProps}
          // Data
          data={filteredData}
          // Rest
          {...rest}
        />
      </div>
    )
  }
}

Table.propTypes = {
  // React Table
  columns: PropTypes.arrayOf(PropTypes.shape({}).isRequired),
  data: PropTypes.arrayOf(PropTypes.shape({}).isRequired),
  ...ReactTable.propTypes,

  // Handlers
  onRowClick: PropTypes.func,

  // Modifiers
  className: PropTypes.string
}

Table.defaultProps = {
  // React Table
  columns: [],
  data: [],

  // Handlers
  onRowClick: null,

  // Modifiers
  className: ''
}

export default Table
