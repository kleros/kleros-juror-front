import React from 'react'
import PropTypes from 'prop-types'
import PieChart from 'react-minimal-pie-chart'

const BalancePieChart = ({ type, balance, total }) => (
  <PieChart
    data={[
      {
        value: balance,
        key: 1,
        color: type === 'activated' ? '#0059ab' : '#47525d'
      },
      { value: total, key: 2, color: '#fff' }
    ]}
    startAngle={270}
    lengthAngle={type === 'activated' ? 360 : -360}
    animate
  />
)

BalancePieChart.propTypes = {
  type: PropTypes.oneOf(['activated', 'locked']).isRequired,
  balance: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
}

export default BalancePieChart
