import PropTypes from 'prop-types'

const ShortHash = ({ hash }) =>
  hash.slice(0, 6) + '...' + hash.slice(hash.length - 4)

ShortHash.propTypes = {
  hash: PropTypes.string.isRequired
}

export default ShortHash
