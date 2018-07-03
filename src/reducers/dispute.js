import PropTypes from 'prop-types'
import createReducer, { createResource } from 'lessdux'

// Shapes
const {
  shape: disputesShape,
  initialState: disputesInitialState
} = createResource(
  PropTypes.arrayOf(
    PropTypes.shape({
      arbitrableContractAddress: PropTypes.string.isRequired,
      arbitratorAddress: PropTypes.string.isRequired,
      arbitrationFeePerJuror: PropTypes.number.isRequired,
      disputeId: PropTypes.number.isRequired,
      firstSession: PropTypes.number.isRequired,
      initialNumberJurors: PropTypes.number.isRequired,
      numberOfAppeals: PropTypes.number.isRequired,
      rulingChoices: PropTypes.number.isRequired,
      state: PropTypes.number.isRequired,
      status: PropTypes.number.isRequired,
      voteCounters: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.number.isRequired).isRequired
      ).isRequired
    }).isRequired
  )
)
const {
  shape: disputeShape,
  initialState: disputeInitialState
} = createResource(
  PropTypes.shape({
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
        createdAt: PropTypes.number.isRequired,
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
        ruling: PropTypes.number.isRequired,
        canRepartition: PropTypes.bool.isRequired,
        canExecute: PropTypes.bool.isRequired
      }).isRequired
    ).isRequired,

    // Store Data
    title: PropTypes.string.isRequired,
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
    appealCreatedAt: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    appealDeadlines: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    appealRuledAt: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    netPNK: PropTypes.number.isRequired,

    // Derived Data
    latestAppealForJuror: PropTypes.number.isRequired
  }),
  { withUpdate: true }
)
export { disputesShape, disputeShape }

// Reducer
export default createReducer({
  disputes: disputesInitialState,
  dispute: disputeInitialState
})
