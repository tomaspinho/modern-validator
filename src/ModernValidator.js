const Promise = require('bluebird');

const ValidationError = require('./ValidationError');

/**
 * Predicate type used in ModernValidator
 * @callback predicate
 * @param {*} value Value to which to apply the predicate
 * @return {undefined} Returns undefined if the predicate passes
 * @throws {string} Throws a string if the predicate fails, indicating the error
 */

/**
 * The main function of the module
 * @function ModernValidator
 * @param {Object.<string, predicate>} schema Maps keys to predicates
 * @return {validator} The validator for a given schema
 */
module.exports = schema => async object => {

    /**
     * @function validator
     * @param {Object.<string, *>} object Object to validate
     * @return {undefined} Returns undefined if the validation passes
     * @throws {ValidationError} An error that wraps the validation errors for each key
     */

    const schemaKeys = Object.keys(schema);

    const promises = schemaKeys
    .map(k => {
        const predicate = schema[k];
        const value = object[k];
        // Promise.resolves converts a non-bluebird promise into one
        return Promise.all([k, Promise.resolve(predicate(value)).reflect()]);
    });

    let shouldThrow = false;

    const results = await Promise.all(promises)
        .then(promises => promises.map(([k, p]) => {
            shouldThrow = shouldThrow || !p.isFulfilled();
            const v = p.isFulfilled() ? p.value() : p.reason();
            return v ? {[k]: v} : {};
        }));

    if (shouldThrow) throw new ValidationError(
        results.reduce((accObject, resultObject) => Object.assign({}, accObject, resultObject), {}));

    return;
};