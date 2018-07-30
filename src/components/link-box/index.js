import React from 'react'
import PropTypes from 'prop-types'

import './link-box.css'

// Hide the broken image box if link cannot resolve to image
const onImgError = e => {
  e.target.style.display = 'none'
}

const LinkBox = ({ link }) => (
  <div className="LinkBox">
    <div className="LinkBox-content">
      <img
        className="LinkBox-content-image"
        src={link}
        onError={onImgError}
        alt=""
      />
    </div>
  </div>
)

LinkBox.propTypes = {
  link: PropTypes.string.isRequired
}

export default LinkBox
