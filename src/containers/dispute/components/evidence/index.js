import React from 'react'
import PropTypes from 'prop-types'

import { ChainData } from '../../../../chainstrap'
import { dateToString } from '../../../../utils/date'
import LabelValueGroup from '../../../../components/label-value-group'
import LinkBox from '../../../../components/link-box'
import * as chainViewConstants from '../../../../constants/chain-view'

const Evidence = ({
  date,
  partyAddress,
  title,
  description,
  URL,
  arbitrableContractAddress,
  isPartyA
}) => (
  <div className="Evidence">
    <small>{dateToString(date, { withTime: false })}</small>
    <h4>Evidence Submitted</h4>
    <LabelValueGroup
      items={[
        {
          label: 'By',
          value: (
            <ChainData
              contractName={chainViewConstants.ARBITRABLE_CONTRACT_NAME}
              contractAddress={arbitrableContractAddress}
              functionSignature={
                isPartyA
                  ? chainViewConstants.ARBITRABLE_CONTRACT_PARTY_A_SIG
                  : chainViewConstants.ARBITRABLE_CONTRACT_PARTY_B_SIG
              }
              parameters={(isPartyA
                ? chainViewConstants.ARBITRABLE_CONTRACT_PARTY_A_PARAMS
                : chainViewConstants.ARBITRABLE_CONTRACT_PARTY_B_PARAMS)()}
            >
              {partyAddress}
            </ChainData>
          ),
          identiconSeed: partyAddress
        },
        { label: 'Title', value: title },
        { label: 'Description', value: description },
        {
          label: 'URL',
          value: (
            <div>
              <LinkBox link={URL} />
            </div>
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
  URL: PropTypes.string.isRequired,
  arbitrableContractAddress: PropTypes.string.isRequired,
  isPartyA: PropTypes.bool.isRequired
}

export default Evidence
