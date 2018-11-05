import Eth from 'ethjs'
import { Kleros } from 'kleros-api'

import * as ethConstants from '../constants/eth'

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const ETHEREUM_PROVIDER = process.env[`REACT_APP_${env}_ETHEREUM_PROVIDER`]
const STORE_PROVIDER = process.env[`REACT_APP_${env}_STORE_PROVIDER`]

let eth
if (process.env.NODE_ENV === 'test')
  eth = new Eth(require('ganache-cli').provider())
else if (window.web3 && window.web3.currentProvider)
  eth = new Eth(window.web3.currentProvider)
else eth = new Eth(new Eth.HttpProvider(ETHEREUM_PROVIDER))

let ARBITRATOR_ADDRESS, BONDING_CURVE_ADDRESS
let kleros
let networkID
const initializeKleros = async () => {
  networkID = await eth.net_version()

  ARBITRATOR_ADDRESS =
    process.env[
      `REACT_APP_${env}_${
        ethConstants.NETWORK_MAP[networkID]
      }_ARBITRATOR_ADDRESS`
    ]

  kleros = new Kleros(eth.currentProvider, STORE_PROVIDER, ARBITRATOR_ADDRESS)
}

const initializeBondingCurve = async () => {
  BONDING_CURVE_ADDRESS =
    process.env[
      `REACT_APP_${env}_${
        ethConstants.NETWORK_MAP[networkID]
      }_BONDING_CURVE_ADDRESS`
    ]
}

const ETHAddressRegExpCaptureGroup = '(0x[a-fA-F0-9]{40})'
const ETHAddressRegExp = /0x[a-fA-F0-9]{40}/
const strictETHAddressRegExp = /^0x[a-fA-F0-9]{40}$/

export {
  eth,
  ARBITRATOR_ADDRESS,
  BONDING_CURVE_ADDRESS,
  kleros,
  initializeKleros,
  initializeBondingCurve,
  ETHAddressRegExpCaptureGroup,
  ETHAddressRegExp,
  strictETHAddressRegExp,
  networkID,
  env
}

setTimeout(
  () =>
    console.log(
      'Arbitrator Address: ',
      ARBITRATOR_ADDRESS,
      'Kleros: ',
      kleros,
      'Web3: ',
      window.web3
    ),
  1000
)
