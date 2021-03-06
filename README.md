# modern-validator [![Build Status](https://travis-ci.org/tomaspinho/modern-validator.svg?branch=master)](https://travis-ci.org/tomaspinho/modern-validator) [![Coverage Status](https://coveralls.io/repos/github/tomaspinho/modern-validator/badge.svg?branch=master)](https://coveralls.io/github/tomaspinho/modern-validator?branch=master)

`modern-validator` is a modern (node.js > 8.0) asynchronous nestable functional validator for JavaScript objects. Intended for use with objects representing HTTP request bodies in node.js web frameworks.

## Installation

    npm i modern-validator

## Model

A `schema` is an object that maps values (property names) to predicates (or `arrays` of predicates).

A `predicate` is a function that receives a value and returns a `Promise` which resolves to a _falsy_ value if the validation passes or fails with an error `string` if the validation fails. Examples:

```javascript
function isEqualToOne(value) {
  if (value === 1) return Promise.resolve();
  else return Promise.reject('Value is not equal to one.');
}

const isEqualToNumberInDatabase = value => asyncGetNumberInDatabase()
  .then(number => {
    if (value === number) return;
    else throw "Value is not equal to number in database.";
  });

async function isEqualToTwo(value) {
  if (value === 2) return;
  else throw "Value is not equal to two";
}

const isEqualToStoredNumber = async value => {
  if (value === await asyncGetStoredNumber()) return;
  else throw "Value is not equal to two";
}
```

A `validator` is a function returned by `modern-validator` when called with a `schema` object. It throws a `ValidationError` when any of the values fail validation and returns `undefined` otherwise. Example:

```javascript
const mv = require('modern-validator');

const higherThanZero = async val => { if (val >= 0) return; else throw "Number not higher than zero."; }

const schema = {
  price: higherThanZero
};

const validator = mv(schema);

```

A `validation` is an object that maps the properties in the schema, to the error `strings` produced by the `predicates` (`array` of `strings` if an `array` of `predicates` was specified), if any. It's thrown (inside a `ValidationError`) if an object does not pass validation. Example:

```javascript
// From code above...

try {
  await validator({
    price: -1
  });
  // any subsequent code
} catch (v) {
 /*
 *  v = ValidationError {
 *    message: "Modern Validator encountered validation error(s).",
 *    validation: {
 *      price: "Number not higher than zero."
 *    }
 *  }
 */
}
```

`modern-validator` is nestable in itself, which means the following is a perfectly valid construct:

```javascript
const validator = ModernValidator({
  key1: ModernValidator({
    key1: somePredicate
  })
});
```

## TODO

- Implement utils bag with:
  - `sync/true/false predicate` to `async/return/throw predicate` wrapper;

