import PropTypes from 'prop-types'

import createReducer, { createResource } from '../utils/redux'

// Base Shapes
const dispute = PropTypes.shape({
  // Arbitrable Contract Data
  hash: PropTypes.string.isRequired,
  arbitrableContractAddress: PropTypes.string.isRequired,
  arbitrableContractStatus: PropTypes.number.isRequired,
  arbitratorAddress: PropTypes.string.isRequired,
  partyA: PropTypes.string.isRequired,
  partyB: PropTypes.string.isRequired,

  // Dispute Data
  disputeId: PropTypes.number.isRequired,
  session: PropTypes.number.isRequired,
  numberOfAppeals: PropTypes.number.isRequired,
  fee: PropTypes.number.isRequired,
  deadline: PropTypes.instanceOf(Date).isRequired,
  disputeState: PropTypes.number.isRequired,
  disputeStatus: PropTypes.number.isRequired,
  voteCounters: PropTypes.number.isRequired,
  appealsRepartitioned: PropTypes.number.isRequired,

  // Store Data
  description: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  evidence: PropTypes.arrayOf(
    PropTypes.shape({
      submitter: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  isJuror: PropTypes.bool.isRequired,
  votes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  hasRuled: PropTypes.bool.isRequired,
  ruling: PropTypes.number.isRequired
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
