import React from 'react'
import PropTypes from 'prop-types'

import './chain-table.css'

const ChainTable = ({ columns, data }) => (
  <div className="ChainTable">
    <div className="ChainTable-row ChainTable-row--header">
      {columns.map(c => (
        <div key={c.name} className="ChainTable-row-col">
          {c.name}
        </div>
      ))}
    </div>
    {data.map(d => (
      <div key={d.id} className="ChainTable-row">
        {columns.map(c => (
          <div key={c.name} className="ChainTable-row-col">
            {c.Component ? (
              <c.Component value={c.accessor ? d[c.accessor] : d} />
            ) : (
              d[c.accessor]
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
)

ChainTable.propTypes = {
  // State
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      accessor: PropTypes.string,
      Component: PropTypes.func
    }).isRequired
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired
}

export default ChainTable
