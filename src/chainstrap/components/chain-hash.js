import PropTypes from 'prop-types'

const ChainHash = ({ children }) =>
  children.slice(0, 6) + '...' + children.slice(children.length - 4)

ChainHash.propTypes = {
  // State
  children: PropTypes.string.isRequired
}

export default ChainHash
