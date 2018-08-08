import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { ChainData } from '../../../../chainstrap'
import { ARBITRATOR_ADDRESS } from '../../../../bootstrap/dapp-api'
import { dateToString } from '../../../../utils/date'
import LabelValueGroup from '../../../../components/label-value-group'
import * as chainViewConstants from '../../../../constants/chain-view'

import './ruling.css'

const Ruling = ({
  date,
  votesForPartyA,
  votesForPartyB,
  netPNK,
  ruling,
  disputeID,
  appeals,
  appealNumber,
  metaEvidence
}) => {
  const inProgress = date === null
  const won = netPNK >= 0
  // For now assume all draws for juror had the same ruling
  const jurorRuling =
    _.isNull(ruling)
      ? ''
      : ruling > 0
        ? `You ruled: ${metaEvidence.rulingOptions.titles[ruling - 1]}`
        : 'No Ruling'
  return (
    <div className="Ruling">
      <hr />
      <h4>{metaEvidence.question}</h4>
      <hr />
      <small>
        {inProgress ? 'In Progress' : dateToString(date, { withTime: false })}
      </small>
      <h4>{appealNumber ? `Appeal #${appealNumber}` : ''} Ruling</h4>
      <small>{jurorRuling}</small>
      {!inProgress && (
        <div className="Ruling-outcome">
          <div
            className={`Ruling-outcome-party Ruling-outcome-party--${
              won ? 'positive' : 'negative'
            }`}
          >
            <h4 className="Ruling-outcome-netPNK-label">
              {votesForPartyA === votesForPartyB
                ? 'No Ruling'
                : votesForPartyA > votesForPartyB
                  ? metaEvidence.rulingOptions.titles[0]
                  : metaEvidence.rulingOptions.titles[1]}
            </h4>
          </div>
          <div className="Ruling-outcome-netPNK">
            <h5 className="Ruling-outcome-netPNK-label">
              {won ? 'Received ' : 'Lost '}
            </h5>
            <h4 className="Ruling-outcome-netPNK-label">{netPNK} PNK</h4>
          </div>
        </div>
      )}
      <LabelValueGroup
        items={
          inProgress
            ? []
            : [
                {
                  label: `Voted ${metaEvidence.rulingOptions.titles[0]}`,
                  value: (
                    <ChainData
                      contractName={chainViewConstants.KLEROS_POC_NAME}
                      contractAddress={ARBITRATOR_ADDRESS}
                      functionSignature={
                        chainViewConstants.KLEROS_POC_GET_VOTE_COUNT_SIG
                      }
                      parameters={chainViewConstants.KLEROS_POC_GET_VOTE_COUNT_PARAMS(
                        disputeID,
                        appeals,
                        1
                      )}
                    >
                      {votesForPartyA}
                    </ChainData>
                  )
                },
                {
                  label: `Voted ${metaEvidence.rulingOptions.titles[1]}`,
                  value: (
                    <ChainData
                      contractName={chainViewConstants.KLEROS_POC_NAME}
                      contractAddress={ARBITRATOR_ADDRESS}
                      functionSignature={
                        chainViewConstants.KLEROS_POC_GET_VOTE_COUNT_SIG
                      }
                      parameters={chainViewConstants.KLEROS_POC_GET_VOTE_COUNT_PARAMS(
                        disputeID,
                        appeals,
                        2
                      )}
                    >
                      {votesForPartyB}
                    </ChainData>
                  )
                },
                {
                  label: 'PNK Redistribution',
                  value: (
                    <span
                      className={`Ruling-netPNK Ruling-netPNK--${
                        won ? 'positive' : 'negative'
                      }`}
                    >
                      {won ? '+' : '-'}
                      {netPNK}
                    </span>
                  )
                }
              ]
        }
      />
      <hr />
    </div>
  )
}

Ruling.propTypes = {
  // State
  date: PropTypes.instanceOf(Date),
  votesForPartyA: PropTypes.number.isRequired,
  votesForPartyB: PropTypes.number.isRequired,
  netPNK: PropTypes.number.isRequired,
  ruling: PropTypes.shape,
  disputeID: PropTypes.number.isRequired,
  appeals: PropTypes.number.isRequired,
  appealNumber: PropTypes.number.isRequired,
  metaEvidence: PropTypes.shape.isRequired
}

Ruling.defaultProps = {
  // State
  date: null,
  ruling: null
}

export default Ruling
