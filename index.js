const uuid = require('uuid');

// credit: https://gist.github.com/justmoon/15511f92e5216fa2624b

class BaseError extends Error {
	constructor(message, previous) {
		if (message instanceof Error) {
			previous = message;
			message = null;
		}

		if (previous && !(previous instanceof Error)) {
			throw new Error(`Expected previous to be an instance of Error, got '${typeof previous}' instead.`);
		}

		super(message);

        this.reference = uuid.v4();

		Object.defineProperty(this, 'type', {
			value: this.constructor.name
		});
		Object.defineProperty(this, 'name', {
			value: this.constructor.name
		});
		Object.defineProperty(this, 'status', {
			value: this.constructor.status || 500,
			writable: true
		});
		Error.captureStackTrace(this, this.constructor);
		this.previous = previous;
	}
}

function factory(baseError, name, status) {
	if (typeof baseError === 'string') {
		status = name;
		name = baseError;
		baseError = BaseError;
	}
	if (typeof baseError !== 'function') {
		throw new Error(`baseError needs to be a class, ${typeof baseError} given.`);
	}

	const klass = class extends baseError {};

	Object.defineProperty(klass, 'name', {
		value: name
	});
	Object.defineProperty(klass, 'status', {
		value: status || (baseError.status || 500)
	});
	return klass;
}

factory.BaseError = BaseError;

module.exports = factory;
