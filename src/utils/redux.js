import PropTypes from 'prop-types'

import { constantToCamelCase } from './string'

const actionTypePrefixMap = {
  CREATE: { creating: true, failedCreating: false },
  RECEIVE_CREATED: { creating: false, failedCreating: false },
  FAIL_CREATE: { creating: false, failedCreating: true },
  UPDATE: { updating: true, failedUpdating: false },
  RECEIVE_UPDATED: { updating: false, failedUpdating: false },
  FAIL_UPDATE: { updating: false, failedUpdating: true },
  DELETE: { deleting: true, failedDeleting: false },
  RECEIVE_DELETED: { deleting: false, failedDeleting: false },
  FAIL_DELETE: { deleting: false, failedDeleting: true },

  FETCH: { loading: true, failedLoading: false },
  RECEIVE: { loading: false, failedLoading: false },
  FAIL_FETCH: { loading: false, failedLoading: true }
}

/**
 * Util that makes creating reducers easier.
 * @export default createReducer
 * @param {object} initialState - The initial state for the reducer.
 * @param {object} reducerMap - A map of action type string constants to functions that return a slice of state.
 * @returns {function} - A reducer function.
 */
export default function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    let newState =
      reducerMap && reducerMap[action.type]
        ? reducerMap[action.type](state, action)
        : state

    for (const typePrefix of Object.keys(actionTypePrefixMap)) {
      const typePrefixLen = typePrefix.length
      const actionTypePrefix = action.type.slice(0, typePrefixLen)
      if (typePrefix === actionTypePrefix) {
        const resource = constantToCamelCase(
          action.type.slice(typePrefixLen + 1)
        )
        console.log(resource)
        if (state[resource])
          newState = {
            ...newState,
            [resource]: {
              ...newState[resource],
              data:
                typePrefix.slice(0, 'RECEIVE'.length) === 'RECEIVE' &&
                (!reducerMap || !reducerMap[action.type])
                  ? action.payload[resource]
                  : state[resource].data,
              ...actionTypePrefixMap[typePrefix]
            }
          }
        break
      }
    }

    return newState
  }
}

/**
 * Creates an initial state object with common loading/error props and a prop-types shape with common loading/error props.
 * @export
 * @param {any} shape - The shape to use for the data prop.
 * @param {object} { withCreate = false, withUpdate = false, withDelete = false } = {} - Options object.
 * @returns {object} - an object with the initial state object and a prop-types shape as properties.
 */
export function createResource(
  shape,
  { withCreate = false, withUpdate = false, withDelete = false } = {}
) {
  return {
    shape: PropTypes.shape({
      ...(withCreate
        ? {
            creating: PropTypes.bool.isRequired,
            failedCreating: PropTypes.bool.isRequired
          }
        : null),
      loading: PropTypes.bool.isRequired,
      data: shape,
      failedLoading: PropTypes.bool.isRequired,
      ...(withUpdate
        ? {
            updating: PropTypes.bool.isRequired,
            failedUpdating: PropTypes.bool.isRequired
          }
        : null),
      ...(withDelete
        ? {
            deleting: PropTypes.bool.isRequired,
            failedDeleting: PropTypes.bool.isRequired
          }
        : null)
    }),
    initialState: {
      ...(withCreate
        ? {
            creating: false,
            failedCreating: false
          }
        : null),
      loading: false,
      data: null,
      failedLoading: false,
      ...(withUpdate
        ? {
            updating: false,
            failedUpdating: false
          }
        : null),
      ...(withDelete
        ? {
            deleting: false,
            failedDeleting: false
          }
        : null)
    }
  }
}

/**
 * Creates an object with common create/fetch/update/delete action constants for a given resource name.
 * @export
 * @param {any} resourceName - The name of the resource to create the actions for.
 * @param {object} { withCreate = false, withUpdate = false, withDelete = false } = {} - Options object.
 * @returns {object} - an object with the action constants as properties.
 */
export function createActions(
  resourceName,
  { withCreate = false, withUpdate = false, withDelete = false } = {}
) {
  const actions = {}

  for (const typePrefix of Object.keys(actionTypePrefixMap)) {
    if (/CREATE/.test(typePrefix) && !withCreate) continue
    if (/UPDATE/.test(typePrefix) && !withUpdate) continue
    if (/DELETE/.test(typePrefix) && !withDelete) continue

    actions[typePrefix] = typePrefix + '_' + resourceName
  }

  return actions
}

/**
 * Implements common rendering logic for loading and failures.
 * @export
 * @param {array} shape - The shape whose data rendering depends on.
 * @param {object} renderables - Renderables to render depending on conditions.
 * @param {object} extraValues - Optional extra loading/data/failed values.
 * @returns {any} - A react renderable.
 */
export function renderIf(
  shape,
  {
    loadingExtra,
    failedLoadingExtra,
    creating,
    loading,
    updating,
    deleting,
    done,
    failedCreating,
    failedLoading,
    failedUpdating,
    failedDeleting
  },
  { extraLoadingValues, extraValues, extraFailedValues } = {}
) {
  if (shape.failedCreating) return failedCreating || failedLoading
  if (shape.failedLoading) return failedLoading
  if (shape.failedUpdating) return failedUpdating || failedLoading
  if (shape.failedDeleting) return failedDeleting || failedLoading

  if (shape.creating) return creating || loading
  if (shape.loading) return loading
  if (shape.updating) return updating || loading
  if (shape.deleting) return deleting || loading

  if (extraFailedValues && extraFailedValues.some(v => v))
    return failedLoadingExtra || failedLoading
  if (extraLoadingValues && extraLoadingValues.some(v => v))
    return loadingExtra || loading

  const shapeFailed = shape.data === null || shape.data === undefined
  const extraFailed =
    !extraValues || !extraValues.every(v => v !== null && v !== undefined)
  if (shapeFailed && extraFailed)
    return shapeFailed ? failedLoading : failedLoadingExtra

  return done
}
