const error = require(".");
const assert = require("assert");

const MyError = error("MyError", 400);

try {
	throw new MyError("my-error");
} catch (error) {
	assert(error instanceof MyError);
	assert(error instanceof Error);
	assert(error.message == "my-error");
	assert(error.name == "MyError");
	assert(error.type == "MyError");
	assert(error.status == 400);
}
