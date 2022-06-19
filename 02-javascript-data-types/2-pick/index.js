/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
    var object = {};
    let arrayFromObj = Object.entries(obj)
    for (const [key, value] of arrayFromObj) {
        if (fields.includes(key))
            object[key] = value
    }
    return object
};
