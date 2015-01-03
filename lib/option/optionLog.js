var OPTIONS_LOG_NAME = 'log';
var OPTIONS_LOG_LEVEL_NAME = 'level';

var exports = {};

var getLogOptionProperty = function (options, property) {
  if (options[OPTIONS_LOG_NAME].hasOwnProperty(property)) {
    return options[OPTIONS_LOG_NAME][property];
  }

  return null;
};

var hasLogOptions = function (options) {
  return options && options.hasOwnProperty(OPTIONS_LOG_NAME);
};

exports.OptionLog = function OptionLog(options) {
  this.options = options;

  this.getOptionLogLevel = function () {
    var logLevel = null;

    if (hasLogOptions(this.options)) {
      logLevel = getLogOptionProperty(this.options, OPTIONS_LOG_LEVEL_NAME);
    }

    return logLevel;
  };

};

module.exports = exports;