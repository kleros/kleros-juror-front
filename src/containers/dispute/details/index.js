import React from 'react'
import PropTypes from 'prop-types'

import { dateToString } from '../../../utils/date'
import LabelValueGroup from '../../../components/label-value-group'

import './details.css'

const Details = ({ date, partyAAddress, partyBAddress, arbitrationFee }) => (
  <div className="Details">
    <small>
      {dateToString(date, { withTime: false, numericMonth: false })}
    </small>
    <h4>Dispute Details</h4>
    <LabelValueGroup
      items={[
        {
          label: 'Party A',
          value: partyAAddress,
          identiconSeed: partyAAddress
        },
        {
          label: 'Party B',
          value: partyBAddress,
          identiconSeed: partyBAddress
        },
        { label: 'Arbitration Fee', value: `${arbitrationFee} PNK` }
      ]}
    />
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
