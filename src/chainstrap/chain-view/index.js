import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'

import logo from './assets/logo.png'
import configureStore from './bootstrap/configure-store'
import DataProvenance from './containers/data-provenance'

import './bootstrap/fontawesome'
import './chain-view.css'

export const store = configureStore()

export default class ChainView extends PureComponent {
  state = {
    isOpen: false,
    toggledTabName: null
  }

  handleToggleClick = () =>
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }))

  handleTabToggleClick = ({ currentTarget: { id } }) =>
    this.setState(prevState => ({
      toggledTabName: prevState.toggledTabName === id ? null : id
    }))

  render() {
    const { isOpen, toggledTabName } = this.state

    return (
      <Provider store={store}>
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
            {[{ name: 'Data Provenance', Component: DataProvenance }].map(t => {
              const isToggled = toggledTabName === t.name
              return (
                <div key={t.name} className="ChainView-panel-tab">
                  <h4
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
                  </h4>
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
      </Provider>
    )
  }
}
