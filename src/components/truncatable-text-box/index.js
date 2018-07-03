import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './truncatable-text-box.css'

export default class TruncatableTextBox extends PureComponent {
  static propTypes = {
    // State
    text: PropTypes.string.isRequired,
    maxWords: PropTypes.number.isRequired
  }

  state = { truncated: true }

  toggleMore = () =>
    this.setState(prevState => ({ truncated: !prevState.truncated }))

  render() {
    const { text, maxWords } = this.props
    const { truncated } = this.state

    const words = text.split(' ')
    return (
      <div className="TruncatableTextBoxTextBox">
        <p>
          {truncated && words.length > maxWords
            ? words.slice(0, maxWords).join(' ')
            : text}
        </p>
        {words.length > maxWords && (
          <div
            className="TruncatableTextBoxTextBox-actionDiv"
            onClick={this.toggleMore}
          >
            Show {truncated ? 'More ∧' : 'Less ∨'}
          </div>
        )}
      </div>
    )
  }
}
