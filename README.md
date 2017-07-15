# modern-validator

`modern-validator` is a modern (node.js > 8.0) asynchronous functional validator for JavaScript objects. Intended for use with objects representing HTTP request bodies in node.js web frameworks.

## Model

A `schema` is an object that maps values (property names) to predicates.

A `predicate` is a function that receives a value and returns a `Promise` which resolves if the validation passes or fails with an error `string` if the validation fails. Examples:

```
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
