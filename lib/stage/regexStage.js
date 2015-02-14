var logger = require('../logger/logger').logger;
var AbstractStage = require('../stage/abstractStage').AbstractStage;

var exports = {};

exports.TYPE = 'regex';

exports.RegexStage = function RegexStage() {
  AbstractStage.call(this);

  this.getName = function () {
    return exports.TYPE;
  };

  this.execute = function (value, options, callback) {
    logger.debug('Executing regex stage for value');

    var err = null;
    var result = null;

    var pattern = new RegExp(value);

    var matches = options.content.match(pattern);

    if (matches) {
      result = matches[1];
    }

    return callback(err, result);
  };
};

module.exports = exports;