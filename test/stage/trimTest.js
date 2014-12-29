var trimStage = require('../../lib/stage/trimStage');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('Trim stage test', function () {

  it('should trim value', function (done) {

    var content = ' trimmed value ';
    var options = {
    };

    trimStage.stage(content, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('trimmed value');
      done();
    });
  });

  it('should return null for null value', function (done) {

    var content = null;
    var options = {
    };

    trimStage.stage(content, options, function (err, result) {
      should.not.exist(err);
      should.not.exist(result);
      done();
    });
  });

});