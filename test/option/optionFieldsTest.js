var optionFields = require('../../lib/option/optionFields');
var ParseOptions = require('../../lib/model/parseOptions').ParseOptions;
var InvalidOptionFieldError = require('../../lib/error/invalidOptionFieldError').InvalidOptionFieldError;
var InvalidOptionValueError = require('../../lib/error/invalidOptionValueError').InvalidOptionValueError;
var ParseFieldSelector = require('../../lib/model/parseFieldSelector').ParseFieldSelector;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('option fields test', function () {

  it('should throw error on missing "fields" property in options', function (done) {

    var options = {
    };

    (function () {
      optionFields.getOptionFields(options);
    }).should.throw(InvalidOptionValueError);

    done();
  });

  it('should throw error on empty "fields" options', function (done) {

    var options = {
      fields: [
      ]
    };

    (function () {
      optionFields.getOptionFields(options);
    }).should.throw(InvalidOptionValueError);

    done();
  });

  it('should parse "selector" type field', function (done) {

    var options = {
      fields: [
        {
          name: "name",
          steps: [
            {
              type: "selector",
              selector: "#id"
            }
          ]
        }
      ]
    };

    var fields = optionFields.getOptionFields(options);

    expect(fields).to.be.not.empty();
    expect(fields[0].name).to.equal('name');
    expect(fields[0].steps).to.be.not.empty();
    expect(fields[0].steps[0]).to.be.an.instanceof(ParseFieldSelector);
    expect(fields[0].steps[0].selector).to.equal('#id');

    done();
  });

  it('should throw error on missing "type" field', function (done) {

    var options = {
      fields: [
        {
          name: "name",
          steps: [
            {
              selector: "#id"
            }
          ]
        }
      ]
    };

    (function () {
      optionFields.getOptionFields(options);
    }).should.throw(InvalidOptionFieldError);

    done();
  });

  it('should throw error on missing "selector" field', function (done) {

    var options = {
      fields: [
        {
          name: "name",
          steps: [
            {
              type: "selector"
            }
          ]
        }
      ]
    };

    (function () {
      optionFields.getOptionFields(options);
    }).should.throw(InvalidOptionFieldError);

    done();
  });

  it('should throw error on empty "selector" field', function (done) {

    var options = {
      fields: [
        {
          name: "name",
          steps: [
            {
              type: "selector",
              selector: ""
            }
          ]
        }
      ]
    };

    (function () {
      optionFields.getOptionFields(options);
    }).should.throw(InvalidOptionFieldError);

    done();
  });

  it('should throw error on missing "name" field', function (done) {

    var options = {
      fields: [
        {
          steps: [
            {
              type: "selector",
              selector: "#id"
            }
          ]
        }
      ]
    };

    (function () {
      optionFields.getOptionFields(options);
    }).should.throw(InvalidOptionFieldError);

    done();
  });

  it('should skip "unknown" type field', function (done) {

    var options = {
      fields: [
        {
          name: "name",
          steps: [
            {
              type: "selector",
              selector: "#id"
            },
            {
              type: "unknown"
            }
          ]
        }
      ]
    };

    var fields = optionFields.getOptionFields(options);

    expect(fields).to.be.not.empty();
    done();
  });

});