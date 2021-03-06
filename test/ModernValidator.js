const ModernValidator = require('../src/ModernValidator');
const ValidationError = require('../src/ValidationError');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const { expect } = require('chai');

const schema1 = {
    key1: async v => { if (v != 1) throw "Value is different than 1."; else return; }
};

const schema2 = Object.assign({}, schema1, {
    key2: async v => { if (v != 2) throw "Value is different than 2."; else return; }
});

const schema3 = Object.assign({}, schema2, {
    key3: async v => { if (v != 3) throw "Value is different than 3."; else return; }
});

describe('ModernValidator', () => {

    it('It should not throw when all validations pass (1/1)', () => {
        const validator = ModernValidator(schema1);
        return expect(validator({
            key1: 1
        })).to.eventually.equal(undefined);
    });

    it('It should not throw when all validations pass (2/2)', () => {
        const validator = ModernValidator(schema2);
        return expect(validator({
            key1: 1
        ,   key2: 2
        })).to.eventually.equal(undefined);
    });

    it('It should not throw when all validations pass (3/3)', () => {
        const validator = ModernValidator(schema3);
        return expect(validator({
            key1: 1
        ,   key2: 2
        ,   key3: 3
        })).to.eventually.equal(undefined);
    });

    it('It should throw when a validation does not pass (1/1)', () => {
        const validator = ModernValidator(schema1);
        return expect(validator({
            key1: 2
        }))
        .to.eventually.be.rejectedWith(ValidationError)
        .and.have.property('validation').deep.equal({
            key1: "Value is different than 1."
        });
    });

    it('It should throw when a validation does not pass (1/2)', () => {
        const validator = ModernValidator(schema2);
        return expect(validator({
            key1: 2
        ,   key2: 2
        }))
        .to.eventually.be.rejectedWith(ValidationError)
        .and.have.property('validation').deep.equal({
            key1: "Value is different than 1."
        });
    });

    it('It should throw when a validation does not pass (1/3)', () => {
        const validator = ModernValidator(schema3);
        return expect(validator({
            key1: 2
        ,   key2: 2
        ,   key3: 3
        }))
        .to.eventually.be.rejectedWith(ValidationError)
        .and.have.property('validation').deep.equal({
            key1: "Value is different than 1."
        });
    });

    it('It should throw when more than a validation do not pass (2/3)', () => {
        const validator = ModernValidator(schema3);
        return expect(validator({
            key1: 2
        ,   key2: 3
        ,   key3: 3
        }))
        .to.eventually.be.rejectedWith(ValidationError)
        .and.have.property('validation').deep.equal({
            key1: "Value is different than 1."
        ,   key2: "Value is different than 2."
        });
    });

    it('It should support 1 level of nested validators (all pass)', () => {
        const validator = ModernValidator(Object.assign({}, schema1, {
            key2: ModernValidator(schema1)
        }));

        return expect(validator({
            key1: 1
        ,   key2: {
                key1: 1
            }
        })).to.eventually.equal(undefined);
    });

    it('It should support 1 level of nested validators (fail)', () => {
        const validator = ModernValidator(Object.assign({}, schema1, {
            key2: ModernValidator(schema1)
        }));

        return expect(validator({
            key1: 1
        ,   key2: {
                key1: 2
            }
        }))
        .to.eventually.be.rejectedWith(ValidationError)
        .and.have.property('validation').deep.equal({
            key2: {
                key1: "Value is different than 1."
            }
        });
    });

    it('It should support 2 levels of nested validators (all pass)', () => {
        const validator = ModernValidator(Object.assign({}, schema1, {
            key2: ModernValidator({
                key1: ModernValidator(schema1)
            })
        }));

        return expect(validator({
            key1: 1
        ,   key2: {
                key1: {
                    key1: 1
                }
            }
        })).to.eventually.equal(undefined);
    });

    it('It should support 2 levels of nested validators (fail)', () => {
        const validator = ModernValidator(Object.assign({}, schema1, {
            key2: ModernValidator({
                key1: ModernValidator(schema1)
            })
        }));

        return expect(validator({
            key1: 1
        ,   key2: {
                key1: {
                    key1: 2
                }
            }
        }))
        .to.eventually.be.rejectedWith(ValidationError)
        .and.have.property('validation').deep.equal({
            key2: {
                key1: {
                    key1: "Value is different than 1."
                }
            }
        });
    });
});