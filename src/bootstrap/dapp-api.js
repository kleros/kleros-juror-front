import Eth from 'ethjs'
import { Kleros } from 'kleros-api'

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const ETHEREUM_PROVIDER = process.env[`REACT_APP_${env}_ETHEREUM_PROVIDER`]
const STORE_PROVIDER = process.env[`REACT_APP_${env}_STORE_PROVIDER`]
const ARBITRATOR_ADDRESS = process.env[`REACT_APP_${env}_ARBITRATOR_ADDRESS`]

let eth
if (process.env.NODE_ENV === 'test')
  eth = new Eth(require('ganache-cli').provider())
else if (window.web3 && window.web3.currentProvider)
  eth = new Eth(window.web3.currentProvider)
else eth = new Eth.HttpProvider(ETHEREUM_PROVIDER)

const network = eth
  .net_version()
  .then(networkID => {
    switch (networkID) {
      case '1':
        return 'main'
      case '3':
        return 'ropsten'
      case '4':
        return 'rinkeby'
      case '42':
        return 'kovan'
      default:
        return null
    }
  })
  .catch(() => null)

const kleros = new Kleros(
  eth.currentProvider,
  STORE_PROVIDER,
  ARBITRATOR_ADDRESS
)

const ETHAddressRegExpCaptureGroup = '(0x[a-fA-F0-9]{40})'
const ETHAddressRegExp = /0x[a-fA-F0-9]{40}/
const strictETHAddressRegExp = /^0x[a-fA-F0-9]{40}$/

export {
  eth,
  network,
  kleros,
  ARBITRATOR_ADDRESS,
  ETHAddressRegExpCaptureGroup,
  ETHAddressRegExp,
  strictETHAddressRegExp
}

setTimeout(() => console.log('Kleros: ', kleros, 'Web3: ', window.web3), 1000)
