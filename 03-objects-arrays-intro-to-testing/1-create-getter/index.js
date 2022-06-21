/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    let arr = path.split('.');
    let lastValue = arr[arr.length - 1];
    let coint = 0

    return function foo(obj) {
        coint++
        if (coint === arr.length) return obj[lastValue];
        for (let deep of Object.values(obj)) {
            return foo(deep);
        }
    };

}
