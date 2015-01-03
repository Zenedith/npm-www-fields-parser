var OPTIONS_LOG_NAME = 'log';
var OPTIONS_LOG_LEVEL_NAME = 'level';

var exports = {};

exports.getOptionLogLevel = function (options) {
  var logLevel = null;

  if (options && options.hasOwnProperty(OPTIONS_LOG_NAME)) {
    if (options[OPTIONS_LOG_NAME].hasOwnProperty(OPTIONS_LOG_LEVEL_NAME)) {
      logLevel = options[OPTIONS_LOG_NAME][OPTIONS_LOG_LEVEL_NAME];
    }
  }

  return logLevel;
};

module.exports = exports;