/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    var object = {};
    let arrayFromObj = Object.entries(obj)
    for (const [key, value] of arrayFromObj) {
        if (!fields.includes(key)) 
        object[key] = value
    }
    return object
};
