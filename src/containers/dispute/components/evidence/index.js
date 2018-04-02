import React from 'react'
import PropTypes from 'prop-types'

import { dateToString } from '../../../../utils/date'
import LabelValueGroup from '../../../../components/label-value-group'

const Evidence = ({ date, partyAddress, title, description, URL }) => (
  <div className="Evidence">
    <small>
      {dateToString(date, { withTime: false, numericMonth: false })}
    </small>
    <h4>Evidence Submitted</h4>
    <LabelValueGroup
      items={[
        { label: 'By', value: partyAddress, identiconSeed: partyAddress },
        { label: 'Title', value: title },
        { label: 'Description', value: description },
        {
          label: 'URL',
          value: (
            <a href={URL} target="_blank" rel="noopener noreferrer">
              {URL.slice(0, 30)}...
            </a>
          )
        }
      ]}
    />
    <hr />
  </div>
)

Evidence.propTypes = {
  // State
  date: PropTypes.instanceOf(Date).isRequired,
  partyAddress: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  URL: PropTypes.string.isRequired
}

export default Evidence
