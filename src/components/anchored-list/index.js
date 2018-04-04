import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import zenscroll from 'zenscroll'

import './anchored-list.css'

export default class AnchoredList extends PureComponent {
  static propTypes = {
    // State
    items: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.shape({
          anchor: PropTypes.string,
          element: PropTypes.element.isRequired
        }),
        PropTypes.bool
      ]).isRequired
    ).isRequired
  }

  state = {
    anchorBottoms: []
  }

  ref = null
  childRefs = []

  componentDidMount() {
    this.handleScroll()
  }

  calcAnchorLeftAndOpacity(i) {
    const defaultLeft = -6
    const defaultOpacity = 1
    const defaultLeftAndOpacity = {
      left: `calc(5% + ${defaultLeft}px)`,
      opacity: defaultOpacity
    }
    if (i === 0) return defaultLeftAndOpacity

    const { anchorBottoms } = this.state
    if (anchorBottoms[i - 1] !== anchorBottoms[i]) return defaultLeftAndOpacity

    let count = i - 1 // Already counted the first one
    while (count >= 0 && anchorBottoms[count - 1] === anchorBottoms[count])
      count--
    count = i - count

    return {
      left: `calc(5% + ${defaultLeft - count * 8}px)`,
      opacity: defaultOpacity - count * 0.1
    }
  }

  getRef = ref => {
    this.scroller = zenscroll.createScroller(ref)
    this.ref = ref
  }

  getChildRef = ref => (this.childRefs = [...this.childRefs, ref])

  handleScroll = () =>
    this.ref &&
    this.childRefs.length &&
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

  handleAnchorClick = ({ currentTarget: { id } }) =>
    this.scroller.to(this.childRefs[id])

  render() {
    const { items } = this.props
    const { anchorBottoms } = this.state

    return (
      <div
        ref={this.getRef}
        className="AnchoredList"
        onScroll={this.handleScroll}
      >
        <div className="AnchoredList-container">
          <div className="AnchoredList-container-margin" />
          {items.filter(i => i).map((item, i) => (
            <div
              key={item.element.key}
              ref={this.getChildRef}
              className="AnchoredList-container-item"
            >
              {item.anchor && (
                <div
                  id={i}
                  className="AnchoredList-container-item-anchor"
                  style={{
                    bottom: anchorBottoms[i],
                    ...this.calcAnchorLeftAndOpacity(i)
                  }}
                  data-tip={item.anchor}
                  data-type="info"
                  onClick={this.handleAnchorClick}
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
