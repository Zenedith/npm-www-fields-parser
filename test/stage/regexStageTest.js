var RegexStage = require('../../lib/stage/regexStage').RegexStage;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('Regex stage test', function () {

  it('should get value from regex', function (done) {

    var options = {
      content: '<html><p><span>Engine power: </span> <strong> <span class="value">55 kW </span> </strong></p></html>'
    };

    var regexStage = new RegexStage();
    regexStage.execute('<.+>Engine power: </.+>.+<.+ class="value">(.+?)</.+>', options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal('55 kW ');
      done();
    });
  });

});