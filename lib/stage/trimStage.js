var logger = require('../logger/logger').logger;
var AbstractStage = require('../stage/abstractStage').AbstractStage;

var exports = {};

exports.TYPE = 'trim';

exports.TrimStage = function TrimStage() {
  AbstractStage.call(this);

  this.getName = function () {
    return exports.TYPE;
  };

  this.execute = function (value, options, callback) {
    logger.debug('Executing trim stage for: ' + value);

    var result = '';  //default empty string

    if (value) {
      result = value.trim()
    }

    return callback(null, result);
  };
};

module.exports = exports;