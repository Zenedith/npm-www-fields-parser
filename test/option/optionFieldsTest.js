var optionFields = require('../../lib/option/optionFields');
var InvalidOptionFieldError = require('../../lib/error/invalidOptionFieldError').InvalidOptionFieldError;
var InvalidOptionValueError = require('../../lib/error/invalidOptionValueError').InvalidOptionValueError;
var SelectorStage = require('../../lib/stage/selectorStage').SelectorStage;
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

  it('should throw error on empty "stages" options', function (done) {

    var options = {
      fields: [
        {
          name: 'name',
          stages: [
          ]
        }
      ]
    };

    (function () {
      optionFields.getOptionFields(options);
    }).should.throw(InvalidOptionFieldError);

    done();
  });

  it('should parse "selector" type field', function (done) {

    var options = {
      fields: [
        {
          name: 'name',
          stages: [
            {
              type: 'selector',
              opts: ['#id']
            }
          ]
        }
      ]
    };

    var fields = optionFields.getOptionFields(options);

    expect(fields).to.have.length(1);
    expect(fields[0].getName()).to.equal('name');
    var stages = fields[0].getStages();
    expect(stages).to.have.length(1);
    expect(stages[0]).to.be.an.instanceof(SelectorStage);
    expect(stages[0].getSelector()).to.equal('#id');

    done();
  });

  it('should throw error on missing "type" field', function (done) {

    var options = {
      fields: [
        {
          name: 'name',
          stages: [
            {
              opts: ['#id']
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

  it('should throw error on missing "opts" field for selector', function (done) {

    var options = {
      fields: [
        {
          name: 'name',
          stages: [
            {
              type: 'selector'
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

  it('should throw error on empty "opts" field for selector', function (done) {

    var options = {
      fields: [
        {
          name: 'name',
          stages: [
            {
              type: 'selector',
              opts: []
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
          stages: [
            {
              type: 'selector',
              opts: ['#id']
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
          name: 'name',
          stages: [
            {
              type: 'selector',
              opts: ['#id']
            },
            {
              type: 'unknown'
            }
          ]
        }
      ]
    };

    var fields = optionFields.getOptionFields(options);

    expect(fields).to.have.length(1);
    done();
  });

});