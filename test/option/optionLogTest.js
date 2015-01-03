var OptionLog = require('../../lib/option/optionLog').OptionLog;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('option log test', function () {

  it('should get log level from options', function (done) {

    var options = {
      log: {
        level: 'info'
      }
    };

    var optionLog = new OptionLog(options);
    expect(optionLog.getOptionLogLevel()).to.equal('info');
    done();
  });


});