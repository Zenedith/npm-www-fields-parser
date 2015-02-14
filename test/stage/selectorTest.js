var selectorStage = require('../../lib/stage/selectorStage');
var SelectorStage = selectorStage.SelectorStage;
var StageError = require('../../lib/error/stageError').StageError;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var content = '<html><div class="divclass" id="divid">div value</div><input name="inputname" class="inputclass" id="inputid">input value</input></html>';

var options = {
  content: content
};

selectorStage.prepareContext(options, content);

describe('Selector stage test', function () {

  it('should get value from div selector by class', function (done) {

    var selectorStage = new SelectorStage('.divclass');
    selectorStage.execute(null, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('div value');
      done();
    });
  });

  it('should get value from input selector by class', function (done) {

    var selectorStage = new SelectorStage('.inputclass');
    selectorStage.execute(null, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('input value');
      done();
    });
  });

  it('should get value from div selector by id', function (done) {

    var selectorStage = new SelectorStage('#divid');
    selectorStage.execute(null, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('div value');
      done();
    });
  });

  it('should get value from input selector by id', function (done) {

    var selectorStage = new SelectorStage('#inputid');
    selectorStage.execute(null, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('input value');
      done();
    });
  });

  it('should get empty value from unknown id selector', function (done) {

    var selectorStage = new SelectorStage('#unknown');
    selectorStage.execute(null, options, function (err, result) {
      should.not.exist(err);
      should.not.exist(result);
      done();
    });
  });

  it('should return error on missing "selector" option', function (done) {

    var selectorStage = new SelectorStage('');
    selectorStage.execute(null, options, function (err, result) {
      should.exist(err);
      expect(err).to.be.an.instanceof(StageError);
      should.not.exist(result);
      done();
    });
  });

});