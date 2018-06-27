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
else eth = new Eth.HttpProvider(ETHEREUM_PROVIDER)

let arbitratorAddress
let kleros
const _initializeKleros = async () => {
  const networkID = await eth.net_version()

  arbitratorAddress =
    process.env[
      `REACT_APP_${ethConstants.NETWORK[networkID]}_${env}_ARBITRATOR_ADDRESS`
    ]

  kleros = new Kleros(eth.currentProvider, STORE_PROVIDER, arbitratorAddress)
}

const ETHAddressRegExpCaptureGroup = '(0x[a-fA-F0-9]{40})'
const ETHAddressRegExp = /0x[a-fA-F0-9]{40}/
const strictETHAddressRegExp = /^0x[a-fA-F0-9]{40}$/

export {
  eth,
  kleros,
  arbitratorAddress,
  _initializeKleros,
  ETHAddressRegExpCaptureGroup,
  ETHAddressRegExp,
  strictETHAddressRegExp
}

setTimeout(() => console.log('Kleros: ', kleros, 'Web3: ', window.web3), 1000)
setTimeout(() => console.log('Arbitrator Address: ', arbitratorAddress), 1000)
