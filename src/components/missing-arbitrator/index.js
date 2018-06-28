import React from 'react'

import './missing-arbitrator.css'

const MissingArbitrator = () => (
  <div className="MissingArbitrator">
    <div className="MissingArbitrator-message">
      <span>
        Oh no! There is no arbitrator contract deployed on this network. Please
        switch networks.
      </span>
    </div>
  </div>
)

export default MissingArbitrator
