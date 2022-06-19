/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    let arrCopy = arr.slice()
    function sortArray(a, b) {
        return a.localeCompare(b, 'ru', { caseFirst: 'upper', sensitivity: 'case' });
    }
    arrCopy.sort(sortArray);
    if (param === 'desc') return arrCopy.reverse()
    if (param === 'asc') return arrCopy;
}
