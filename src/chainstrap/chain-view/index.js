import React, { Component } from 'react'

import logo from '../assets/logo.png'

import './chain-view.css'

class ChainView extends Component {
  state = {
    isOpen: false
  }

  handleToggleClick = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))
  }

  render() {
    const { isOpen } = this.state

    return (
      <div className="ChainView">
        <div
          className={`ChainView-toggle ${isOpen ? 'is-open' : ''}`}
          onClick={this.handleToggleClick}
        >
          <img
            className="ChainView-toggle-image"
            src={logo}
            alt="ChainStrap Logo"
          />
        </div>
        <div className={`ChainView-panel ${isOpen ? 'is-open' : ''}`}>
          Hello
        </div>
      </div>
    )
  }
}

export default ChainView
