import React from 'react'
import PropTypes from 'prop-types'

import { dateToString } from '../../../../utils/date'
import LabelValueGroup from '../../../../components/label-value-group'

import './evidence.css'

const Evidence = ({ date, partyAddress, URIs }) => (
  <div className="Evidence">
    <small>
      {dateToString(date, { withTime: false, numericMonth: false })}
    </small>
    <h4>Evidence Submitted</h4>
    <LabelValueGroup
      items={[
        { label: 'By', value: partyAddress, identiconSeed: partyAddress }
      ]}
    />
    {URIs.map(URI => (
      <div key={URI} className="Evidence-file">
        <a href={URI} target="_blank">
          {URI.slice(URI.lastIndexOf('/') + 1)}
        </a>
      </div>
    ))}
    <hr />
  </div>
)

Evidence.propTypes = {
  // State
  date: PropTypes.instanceOf(Date).isRequired,
  partyAddress: PropTypes.string.isRequired,
  URIs: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
}

export default Evidence
