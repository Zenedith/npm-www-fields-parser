var selectorStage = require('../../lib/stage/selectorStage');
var StageError = require('../../lib/error/stageError').StageError;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('Selector stage test', function () {

  it('should get value from div selector by class', function (done) {

    var content = '<html><div class="class">div value</div></html>';
    var options = {
      selector: '.class'
    };

    selectorStage.stage(content, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('div value');
      done();
    });
  });

  it('should get value from input selector by class', function (done) {

    var content = '<html><input name="id" class="class">input value</input></html>';
    var options = {
      selector: '.class'
    };

    selectorStage.stage(content, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('input value');
      done();
    });
  });

  it('should get value from div selector by id', function (done) {

    var content = '<html><div id="id">div value</div></html>';
    var options = {
      selector: '#id'
    };

    selectorStage.stage(content, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('div value');
      done();
    });
  });

  it('should get value from input selector by id', function (done) {

    var content = '<html><input name="id" id="id">input value</input></html>';
    var options = {
      selector: '#id'
    };

    selectorStage.stage(content, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('input value');
      done();
    });
  });

  it('should get empty value from unknown id selector', function (done) {

    var content = '<html><div id="id">value</div></html>';
    var options = {
      selector: '#unknown'
    };

    selectorStage.stage(content, options, function (err, result) {
      should.not.exist(err);
      should.not.exist(result);
      done();
    });
  });

  it('should return error on missing "selector" option', function (done) {

    var content = '';
    var options = {
    };

    selectorStage.stage(content, options, function (err, result) {
      should.exist(err);
      expect(err).to.be.an.instanceof(StageError);
      should.not.exist(result);
      done();
    });
  });

});