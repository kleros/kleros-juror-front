import Eth from 'ethjs'
import { Kleros } from 'kleros-api'

const env = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'
const ETHEREUM_PROVIDER = process.env[`REACT_APP_${env}_ETHEREUM_PROVIDER`]
const STORE_PROVIDER = process.env[`REACT_APP_${env}_STORE_PROVIDER`]
const ARBITRATOR_ADDRESS = process.env[`REACT_APP_${env}_ARBITRATOR_ADDRESS`]

let eth
if (process.env.NODE_ENV === 'test')
  eth = new Eth(require('ethereumjs-testrpc').provider())
else if (window.web3 && window.web3.currentProvider)
  eth = new Eth(window.web3.currentProvider)
else eth = new Eth.HttpProvider(ETHEREUM_PROVIDER)

const kleros = new Kleros(eth.currentProvider, STORE_PROVIDER)

export { eth, kleros, ETHEREUM_PROVIDER, STORE_PROVIDER, ARBITRATOR_ADDRESS }
