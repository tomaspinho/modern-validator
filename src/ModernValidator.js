const Promise = require('bluebird');

const ValidationError = require('./ValidationError');

module.exports = schema => async object => {

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