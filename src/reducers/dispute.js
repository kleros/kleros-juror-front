import PropTypes from 'prop-types'

import createReducer, { createResource } from '../utils/redux'

// Base Shapes
const dispute = PropTypes.shape({
  // Arbitrable Contract Data
  arbitrableContractAddress: PropTypes.string.isRequired,
  arbitrableContractStatus: PropTypes.number.isRequired,
  arbitratorAddress: PropTypes.string.isRequired,
  partyA: PropTypes.string.isRequired,
  partyB: PropTypes.string.isRequired,

  // Dispute Data
  disputeId: PropTypes.number.isRequired,
  firstSession: PropTypes.number.isRequired,
  lastSession: PropTypes.number.isRequired,
  numberOfAppeals: PropTypes.number.isRequired,
  disputeState: PropTypes.number.isRequired,
  disputeStatus: PropTypes.number.isRequired,
  appealJuror: PropTypes.arrayOf(
    PropTypes.shape({
      fee: PropTypes.number.isRequired,
      draws: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
      canRule: PropTypes.bool.isRequired
    }).isRequired
  ).isRequired,
  appealRulings: PropTypes.arrayOf(
    PropTypes.shape({
      voteCounter: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
      deadline: PropTypes.number.isRequired,
      ruledAt: PropTypes.number.isRequired,
      ruling: PropTypes.number.isRequired
    }).isRequired
  ).isRequired,

  // Store Data
  description: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  evidence: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      submittedAt: PropTypes.number.isRequired,
      submitter: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  netPNK: PropTypes.number.isRequired,
  appealCreatedAt: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  appealDeadlines: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  appealRuledAt: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,

  // Derived Data
  latestAppealForJuror: PropTypes.number.isRequired
})

// Shapes
const {
  shape: disputesShape,
  initialState: disputesInitialState
} = createResource(PropTypes.arrayOf(dispute.isRequired))
const {
  shape: disputeShape,
  initialState: disputeInitialState
} = createResource(dispute, { withUpdate: true })
export { disputesShape, disputeShape }

// Reducer
export default createReducer({
  disputes: disputesInitialState,
  dispute: disputeInitialState
})

// Selectors
