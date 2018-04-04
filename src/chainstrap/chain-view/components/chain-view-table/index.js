import React from 'react'
import PropTypes from 'prop-types'

import './chain-view-table.css'

const ChainViewTable = ({ columns, data }) => (
  <div className="ChainViewTable">
    <div className="ChainViewTable-row ChainViewTable-row--header">
      {columns.map(c => (
        <div key={c.name} className="ChainViewTable-row-col">
          {c.name}
        </div>
      ))}
    </div>
    {data.map(d => (
      <div key={d.id} className="ChainViewTable-row">
        {columns.map(c => (
          <div key={c.name} className="ChainViewTable-row-col">
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

ChainViewTable.propTypes = {
  // State
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Component: PropTypes.func
    }).isRequired
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired
}

export default ChainViewTable
