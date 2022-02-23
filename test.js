const chai = require("chai");
const error = require(".");
const expect = chai.expect;
const util = require("util");

describe("uw-lib-error.js", function () {
	it("exposes BaseError for manual extending", function () {
		expect(error).to.be.an.instanceOf(Function);
	});

	it("factories error classes with name/type, status and message", function () {
		const MyError = error("MyError", 400);

		const err = new MyError("oh-noes");

		expect(err).to.be.an.instanceOf(MyError);
		expect(err).to.be.an.instanceOf(Error);

		expect(err).to.have.property("status", 400);
		expect(err).to.have.property("message", "oh-noes");
		expect(err).to.have.property("type", "MyError");
		expect(err).to.have.property("name", "MyError");
		expect(util.isError(err)).to.be.true;
	});
	it("can create subclasses of errors", function () {
		const MyFirstError = error("MyFirstError", 411);
		const MyError = error(MyFirstError, "MyError");

		const err = new MyError("oh-noes");

		expect(err).to.be.an.instanceOf(MyError);
		expect(err).to.be.an.instanceOf(Error);
		expect(err).to.be.an.instanceOf(MyFirstError);
		expect(err).to.be.an.instanceOf(error.BaseError);

		expect(err).to.have.property("status", 411);
		expect(err).to.have.property("message", "oh-noes");
		expect(err).to.have.property("type", "MyError");
		expect(err).to.have.property("name", "MyError");
		expect(util.isError(err)).to.be.true;
	});
	it("behaves correctly when extending BaseError class", function () {
		class MyBaseError extends error.BaseError {}

		let err = new MyBaseError("oh-noes");

		expect(err).to.be.an.instanceOf(MyBaseError);
		expect(err).to.be.an.instanceOf(Error);
		expect(err).to.be.an.instanceOf(error.BaseError);

		expect(err).to.have.property("status", 500);
		expect(err).to.have.property("message", "oh-noes");
		expect(err).to.have.property("type", "MyBaseError");
		expect(err).to.have.property("name", "MyBaseError");
		expect(util.isError(err)).to.be.true;

		class MyError extends MyBaseError {
			constructor(...args) {
				super(...args);
				this.status = 411;
			}
		}

		err = new MyError("oh-noes");

		expect(err).to.be.an.instanceOf(MyBaseError);
		expect(err).to.be.an.instanceOf(MyError);
		expect(err).to.be.an.instanceOf(Error);
		expect(err).to.be.an.instanceOf(error.BaseError);

		expect(err).to.have.property("status", 411);
		expect(err).to.have.property("message", "oh-noes");
		expect(err).to.have.property("type", "MyError");
		expect(err).to.have.property("name", "MyError");
		expect(util.isError(err)).to.be.true;
	});

	it("default error constructor can take ([previous], message)", function () {
		const My = error("My");

		const prev = new My();

		expect(new My(prev)).to.have.property("previous", prev);
		expect(new My("msg", prev)).to.have.property("previous", prev);
		expect(new My("msg", prev)).to.have.property("message", "msg");
	});

	it("throws when previous is not an Error", function () {
		const My = error("My");

		expect(() => new My("msg", "not-an-error")).to.throw(/instance of Error/);
	});

	it("adds unique reference uuid to each instance of an error", function () {
		const My = error("My");

		const error1 = new My();
		const error2 = new My();

		expect(error1).to.have.property("reference");
		expect(error2).to.have.property("reference");
		expect(error1.reference).to.not.equal(error2.reference);

		class MyError extends error.BaseError {}

		const error3 = new MyError();
		const error4 = new MyError();

		expect(error3).to.have.property("reference");
		expect(error4).to.have.property("reference");
		expect(error3.reference).to.not.equal(error4.reference);
	});
});
