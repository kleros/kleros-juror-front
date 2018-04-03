import React, { Component } from 'react'

import logo from '../assets/logo.png'

import DataProvenance from './containers/data-provenance'

import './chain-view.css'

export default class ChainView extends Component {
  static tabs = [{ name: 'Data Provenance', Component: DataProvenance }]

  state = {
    isOpen: false,
    toggledTabName: null
  }

  handleToggleClick = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))
  }

  handleTabToggleClick = ({ currentTarget: { id } }) => {
    this.setState(prevState => ({
      toggledTabName: prevState.toggledTabName === id ? null : id
    }))
  }

  render() {
    const { isOpen, toggledTabName } = this.state

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
          <h2 className="ChainView-panel-title">ChainView</h2>
          {ChainView.tabs.map(t => {
            const isToggled = toggledTabName === t.name
            return (
              <div className="ChainView-panel-tab">
                <h3
                  id={t.name}
                  className="ChainView-panel-tab-title"
                  onClick={this.handleTabToggleClick}
                >
                  {t.name}
                  <div
                    className={`ChainView-panel-tab-title-toggle ${
                      isToggled ? 'is-toggled' : ''
                    }`}
                  >
                    >
                  </div>
                </h3>
                {isToggled && (
                  <div className="ChainView-panel-tab-content">
                    <t.Component />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
