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
      filteredData: data
    }
  }

  onSearchInputChange = event => {
    const { data } = this.props
    this.setState({
      searchInput: event.target.value,
      filteredData: data.filter(obj => fuzzyObjSearch(event.target.value, obj))
    })
  }

  render() {
    const { className, ...rest } = this.props
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
          // Number of rows
          minRows={rest.data.length || 3}
          pageSizeOptions={[7, 14, 28, 56, 112]}
          defaultPageSize={7}
          // Indicators
          loadingText="Loading..."
          noDataText="No data."
          // Rest
          {...rest}
          // Rest overwrites
          data={filteredData}
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

  // Modifiers
  className: PropTypes.string
}

Table.defaultProps = {
  // React Table
  columns: [],
  data: [],

  // Modifiers
  className: ''
}

export default Table
