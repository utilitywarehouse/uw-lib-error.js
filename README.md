# uw-lib-error.js

An attempt to standardise our approach to structured error in nodejs.

Produced errors are in all means 'real' errors. Will pass checks for errors with instanceof or util.isError, can be thrown and have full stacks.

## Installation

```sh
yarn add @utilitywarehouse/uw-lib-error.js
```

## Usage

This library can be used in two ways:

1) Extending the offered BaseError class with your own classes.

```
const error = require('@utilitywarehouse/uw-lib-error.js');
const assert = require('assert');

class MyError extends error.BaseError {
	constructor (...args) {
		super(...args);
		this.status = 400;
	}
}

try {
	throw new MyError('my-error');
} catch(error) {
	assert(error instanceof MyError);
	assert(error instanceof Error);
	assert(error.message == 'my-error');
	assert(error.name == 'MyError');
	assert(error.type == 'MyError');
	assert(error.status == 400);
}
```

2) By using the (recommended) factory function.
 
```
const error = require('@utilitywarehouse/uw-lib-error.js');
const assert = require('assert');

const MyError = error('MyError', 400);

try {
	throw new MyError('my-error');
} catch(error) {
	assert(error instanceof MyError);
	assert(error instanceof Error);
	assert(error.message == 'my-error');
	assert(error.name == 'MyError');
	assert(error.type == 'MyError');
	assert(error.status == 400);
}

const MyMoreSpecificError = error(MyError, 'MyMoreSpecificError');

try {
	throw new MyMoreSpecificError('my-specific-error');
} catch(error) {
	assert(error instanceof MyError);
	assert(error instanceof Error);
	assert(error instanceof MyMoreSpecificError);
}
```

The factory method has `factory([BaseError], name, [statusCode])` signature, arguments either side of `name` are optional. In case you omit `status` it will use one defined by parent class (500 by default). 

### Default constructor

The `BaseError` constructor will accept a string message and/or a previous exception `constructor(message|previous, [previous])` - the exception has to be of type `Error`.

### Behaviour

```
uw-lib-error.js
    ✓ exposes BaseError for manual extending
    ✓ factories error classes with name/type, status and message
    ✓ can create subclasses of errors
    ✓ behaves correctly when extending BaseError calss
    ✓ default error constructor can take ([previous], message)
    ✓ throws when previous is not an Error
```

