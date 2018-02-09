import React from 'react'
import PropTypes from 'prop-types'

import { dateToString } from '../../../utils/date'
import Identicon from '../../../components/identicon'

import './details.css'

const Details = ({ date, partyAAddress, partyBAddress, arbitrationFee }) => (
  <div className="Details">
    <small>
      {dateToString(date, { withTime: false, numericMonth: false })}
    </small>
    <h4>Dispute Details</h4>
    <div className="Details-table">
      {[
        { label: 'Party A', identicon: true, value: partyAAddress },
        { label: 'Party B', identicon: true, value: partyAAddress },
        { label: 'Arbitration Fee', value: `${arbitrationFee} PNK` }
      ].map(r => (
        <div key={r.label} className="Details-table-row">
          <div className="Details-table-row-column">
            <p className="Details-table-row-column-text">
              <small>{r.label}:</small>
            </p>
          </div>
          <div className="Details-table-row-column">
            {r.identicon && (
              <Identicon
                seed={r.value}
                size={6}
                className="Details-table-row-column-identicon"
              />
            )}
            <p className="Details-table-row-column-text">{r.value}</p>
          </div>
        </div>
      ))}
    </div>
    <hr />
  </div>
)

Details.propTypes = {
  // State
  date: PropTypes.instanceOf(Date).isRequired,
  partyAAddress: PropTypes.string.isRequired,
  partyBAddress: PropTypes.string.isRequired,
  arbitrationFee: PropTypes.number.isRequired
}

export default Details
