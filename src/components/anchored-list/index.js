import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './anchored-list.css'

class AnchoredList extends Component {
  static propTypes = {
    // State
    items: PropTypes.arrayOf(
      PropTypes.shape({
        anchor: PropTypes.string,
        element: PropTypes.element.isRequired
      }).isRequired
    ).isRequired
  }

  state = {
    anchorBottoms: []
  }

  ref = null
  childRefs = []

  componentDidMount() {
    this.setAnchorBottoms()
  }

  getRef = ref => (this.ref = ref)

  getChildRef = ref => (this.childRefs = [...this.childRefs, ref])

  setAnchorBottoms = () =>
    this.setState({
      anchorBottoms: this.childRefs.map(childRef =>
        Math.max(
          this.ref.scrollHeight -
            this.ref.clientHeight -
            this.ref.scrollTop +
            15,
          this.ref.scrollHeight - childRef.offsetTop - 15
        )
      )
    })

  render() {
    const { items } = this.props
    const { anchorBottoms } = this.state

    return (
      <div
        ref={this.getRef}
        className="AnchoredList"
        onScroll={this.setAnchorBottoms}
      >
        <div className="AnchoredList-container">
          <div className="AnchoredList-container-margin" />
          {items.map((item, i) => (
            <div
              key={item.element.key}
              ref={this.getChildRef}
              className="AnchoredList-container-item"
            >
              {item.anchor && (
                <div
                  className="AnchoredList-container-item-anchor"
                  style={{
                    bottom: anchorBottoms[i]
                  }}
                  data-tip={item.anchor}
                  data-type="info"
                />
              )}
              {item.element}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default AnchoredList
