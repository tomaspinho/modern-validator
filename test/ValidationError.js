const assert = require('assert');

const ValidationError = require('../src/ValidationError');

const e = new ValidationError({
    key: "Not equal to 1."
});

describe('ValidationError', () => {

    it('It should have a validation with the expected format', () => {
        assert.deepEqual(e.validation, {
            key: "Not equal to 1."
        });
    });

    it('It should return the proper inspection for use in Node REPL', () => {
        assert.equal(e.inspect(),
            '{ ValidationError: Modern Validator encountered validation error(s).\n  validation: {\n   key: "Not equal to 1."\n  }\n}');
    });
});