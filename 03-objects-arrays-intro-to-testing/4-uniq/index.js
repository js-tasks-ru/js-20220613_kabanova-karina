/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */
export function uniq(arr) {
    let emptyArr = [];
    if (arr) {
        for (const value of arr) {
            if (!emptyArr.includes(value)) emptyArr.push(value);
        }
    }
    return emptyArr;
}
