var TrimStage = require('../../lib/stage/trimStage').TrimStage;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var trimStage = new TrimStage();
var options = {
};

describe('Trim stage test', function () {

  it('should trim value', function (done) {

    var content = ' trimmed value ';

    trimStage.execute(content, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('trimmed value');
      done();
    });
  });

  it('should return empty string for null value', function (done) {

    var content = null;

    trimStage.execute(content, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('');
      done();
    });
  });

});