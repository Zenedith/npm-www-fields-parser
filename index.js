var logger = require('./lib/logger/logger');
var log = logger.logger;
var optionFields = require('./lib/option/optionFields');
var optionLog = require('./lib/option/optionLog');
var webContentParser = require('./lib/parser/webContentParser');
var selectorStage = require('./lib/stage/selectorStage');

var exports = {};

exports.parseContent = function (content, options, callback) {
  var logLevel = optionLog.getOptionLogLevel(options);

  if (logLevel !== null) {
    logger.initLogger(logLevel);
  }

  try {
    var fields = optionFields.getOptionFields(options);
    var parserOptions = selectorStage.prepareContext(content);

    return webContentParser.parse(parserOptions, fields, function (err, results) {

      if (err) {
        log.debug('Failed to parse content: ' + err);
      }

      return callback(err, results);
    });
  }
  catch (e) {
    return callback(e);
  }
};


module.exports = exports;