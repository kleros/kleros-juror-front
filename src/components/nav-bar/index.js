import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'

import * as walletSelectors from '../../reducers/wallet'
import { renderIf } from '../../utils/redux'
import Identicon from '../../components/identicon'
import logo from '../../assets/images/logo.png'

import './nav-bar.css'

const NavBar = ({ accounts, routes }) => (
  <div className="NavBar">
    <a src="https://kleros.io">
      <img className="NavBar-logo" src={logo} alt="Kleros Logo" />
    </a>
    <div className="NavBar-tabs">
      {routes.map(r => (
        <NavLink
          key={r.to}
          className="NavBar-tabs-tab"
          activeClassName="is-active"
          exact
          to={r.to}
        >
          {r.name}
        </NavLink>
      ))}
    </div>
    <div className="NavBar-buttons">
      <div className="NavBar-buttons-button">
        {renderIf(accounts, {
          loading: '...',
          done: accounts.data && <Identicon seed={accounts.data[0]} size={9} />,
          failedLoading: '...'
        })}
      </div>
    </div>
  </div>
)

NavBar.propTypes = {
  // Redux State
  accounts: walletSelectors.accountsShape.isRequired,

  // State
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired
    }).isRequired
  ).isRequired
}

export default NavBar
