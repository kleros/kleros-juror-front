import React from 'react'
import ReduxToastr from 'react-redux-toastr'
import ReactTooltip from 'react-tooltip'

export default () => (
  <div>
    <ReduxToastr
      timeOut={0}
      preventDuplicates
      position="top-center"
      transitionIn="bounceInDown"
      transitionOut="bounceOutUp"
      progressBar
    />
    <ReactTooltip html />
  </div>
)
