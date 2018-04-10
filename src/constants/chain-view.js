/* Wallet */

// Meta Data
export const WALLET_ACCOUNT_1_NAME = 'Account 1'

/* KlerosPOC */

// Meta Data
export const KLEROS_POC_NAME = 'Arbitrator'

// Functions
export const KLEROS_POC_JURORS_SIG =
  'jurors(address) public view returns(uint256 balance, uint256 atStake, uint256 lastSession, uint256 segmentStart, uint256 segmentEnd)'
export const KLEROS_POC_JURORS_PARAMS = _ => ({ 'address _': _ })

export const KLEROS_POC_DISPUTES_SIG =
  'disputes(uint256) public view returns(address arbitrated, uint256 session, uint256 appeals, uint256 choices, uint16 initialNumberJurors, uint256 arbitrationFeePerJuror, uint8 state)'
export const KLEROS_POC_DISPUTES_PARAMS = _ => ({ 'uint256 _': _ })

export const KLEROS_POC_PERIOD_SIG = 'period() public view returns(uint8)'
export const KLEROS_POC_PERIOD_PARAMS = () => undefined

export const KLEROS_POC_SESSION_SIG = 'session() public view returns(uint256)'
export const KLEROS_POC_SESSION_PARAMS = () => undefined
