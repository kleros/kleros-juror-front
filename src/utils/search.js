import { objSome } from './functional'

/**
 * Searches for a string inside another string using fuzzy search logic.
 * @export
 * @param {string} needle - The string to search for.
 * @param {string} haystack - The string to search in.
 * @returns {boolean} - True if the needle was found, false otherwise.
 */
export function needleInAHaystack(needle, haystack) {
  var nLen = needle.length
  var hLen = haystack.length
  if (nLen > hLen) return false
  if (nLen === hLen) return needle === haystack

  let hIndex = 0
  for (const nChar of needle) {
    let found = false
    while (hIndex < hLen) {
      if (nChar.toLowerCase() === haystack[hIndex].toLowerCase()) found = true
      hIndex++
      if (found) break
    }
    if (!found) return false
  }

  return true
}

/**
 * Searches for a string inside all the enumerable properties of an object using fuzzy search logic.
 * @export
 * @param {string} searchStr - The string to search for.
 * @param {object} obj - The object to search in.
 * @returns {boolean} - True if the string was found, false otherwise.
 */
export function fuzzyObjSearch(searchStr, obj) {
  return objSome(obj, value => needleInAHaystack(searchStr, value))
}
