import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './truncated-text-box.css'

class TruncatedTextBox extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    numberOfWords: PropTypes.number.isRequired
  }

  state = {
    truncated: true
  }

  toggleMore = () => {
    const { truncated } = this.state

    this.setState({
      truncated: !truncated
    })
  }

  render() {
    const { text, numberOfWords } = this.props
    const { truncated } = this.state

    if (!text) return false

    const words = text.split(' ')
    let displayText = text
    let actionDiv
    // if there is no need to truncate return as is
    if (words.length > numberOfWords) {
      if (truncated) {
        displayText = ''
        for (let i = 0; i < numberOfWords; i++) {
          displayText += words[i] + ' '
        }
        displayText += '...'
        actionDiv = (
          <div className="TruncatedTextBox-actionDiv" onClick={this.toggleMore}>
            Show More &or;
          </div>
        )
      } else {
        displayText = text
        actionDiv = (
          <div className="TruncatedTextBox-actionDiv" onClick={this.toggleMore}>
            Show Less &and;
          </div>
        )
      }
    }

    return (
      <div className="TruncatedTextBox">
        <p>{displayText}</p>
        {actionDiv}
      </div>
    )
  }
}

export default TruncatedTextBox
