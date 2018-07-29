import React from 'react'
import PropTypes from 'prop-types'
import PieChart from 'react-minimal-pie-chart'

const BalancePieChart = ({ type, balance, total, size }) => (
  <PieChart
    data={[
      {
        value: balance,
        key: 1,
        color: type === 'activated' ? '#0059ab' : '#47525d'
      },
      { value: balance ? total - balance : 1, key: 2, color: '#f5f8fa' } // If total is 0, make the entire pie chart white
    ]}
    startAngle={270}
    lengthAngle={type === 'activated' ? 360 : -360}
    style={size ? { height: size, width: size } : undefined}
    animate
  />
)

BalancePieChart.propTypes = {
  // State
  type: PropTypes.oneOf(['activated', 'locked']).isRequired,
  balance: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired
}

export default BalancePieChart
