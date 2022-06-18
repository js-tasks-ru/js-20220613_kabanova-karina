/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    let object = obj
    fields.map((item) => {
        for (const [key, value] of Object.entries(obj)) {
            if (key === item) {
                delete object[key]
            }
        }
    });
    return object
};
