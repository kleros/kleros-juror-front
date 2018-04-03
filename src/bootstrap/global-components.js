import React from 'react'
import ReactTooltip from 'react-tooltip'
import ReduxToastr from 'react-redux-toastr'

import ChainView from '../chainstrap'

export default () => (
  <div>
    <ChainView />
    <ReactTooltip />
    <ReduxToastr
      timeOut={0}
      position="top-center"
      transitionIn="bounceInDown"
      transitionOut="bounceOutUp"
      progressBar
    />
  </div>
)
