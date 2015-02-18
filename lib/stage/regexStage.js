var logger = require('../logger/logger').logger;
var AbstractStage = require('../stage/abstractStage').AbstractStage;
var StageError = require('../error/stageError').StageError;

var exports = {};

exports.TYPE = 'regex';

exports.RegexStage = function RegexStage(regex) {
  AbstractStage.call(this);

  this.getName = function () {
    return exports.TYPE;
  };

  this.execute = function (value, options, callback) {
    logger.debug('Executing regex stage for value');

    var err = null;
    var result = null;

    if (!regex) {
      err = new StageError('Missing "regex" for regexStage');
      return callback(err, result);
    }

    var pattern = new RegExp(regex);

    var matches = options.content.match(pattern);

    if (matches) {
      result = matches[1];
    }

    return callback(err, result);
  };
};

module.exports = exports;