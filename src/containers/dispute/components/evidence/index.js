import React from 'react'
import PropTypes from 'prop-types'

import { ChainData } from '../../../../chainstrap'
import { dateToString } from '../../../../utils/date'
import LabelValueGroup from '../../../../components/label-value-group'
import LinkBox from '../../../../components/link-box'
import * as chainViewConstants from '../../../../constants/chain-view'

const Evidence = ({
  evidenceValid,
  fileValid,
  evidenceJSON,
  submittedBy,
  submittedAt,
  evidenceDisplayInterface,
  evidenceDisplayInterfaceValid
}) => (
  <div className="Evidence">
    <small>{dateToString(submittedAt, { withTime: false })}</small>
    <h4>Evidence Submitted</h4>
    <LabelValueGroup
      items={[
        {
          label: 'Submitted By',
          value: submittedBy,
          identiconSeed: submittedBy
        },
        { label: 'Name', value: evidenceJSON.name },
        { label: 'Description', value: evidenceJSON.description },
        { label: 'Link', value: evidenceJSON.url }
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
  URL: PropTypes.string.isRequired,
  arbitrableContractAddress: PropTypes.string.isRequired,
  isPartyA: PropTypes.bool.isRequired
}

export default Evidence
