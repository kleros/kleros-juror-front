import PropTypes from 'prop-types'

import createReducer, { createResource } from '../utils/redux'

// Reusable Shapes
const dispute = PropTypes.shape({
  disputeId: PropTypes.number.isRequired,
  disputeState: PropTypes.number.isRequired,
  disputeStatus: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  deadline: PropTypes.number.isRequired,
  fee: PropTypes.number.isRequired,
  arbitratorAddress: PropTypes.number.isRequired,
  arbitrableContractAddress: PropTypes.number.isRequired,
  arbitrableContractStatus: PropTypes.number.isRequired,
  partyA: PropTypes.number.isRequired,
  partyB: PropTypes.number.isRequired,
  email: PropTypes.number.isRequired,
  evidence: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  session: PropTypes.number.isRequired,
  isJuror: PropTypes.bool.isRequired,
  hasRuled: PropTypes.bool.isRequired,
  votes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  ruling: PropTypes.number.isRequired,
  hash: PropTypes.number.isRequired
})

// Shapes
const {
  shape: disputesShape,
  initialState: disputesInitialState
} = createResource(PropTypes.arrayOf(dispute.isRequired))
const {
  shape: disputeShape,
  initialState: disputeInitialState
} = createResource(dispute)
export { disputesShape, disputeShape }

// Reducer
export default createReducer({
  disputes: disputesInitialState,
  dispute: disputeInitialState
})

// Selectors
