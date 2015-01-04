var logger = require('./lib/logger/logger');
var log = logger.logger;
var optionFields = require('./lib/option/optionFields');
var OptionLog = require('./lib/option/optionLog').OptionLog;
var webContentParser = require('./lib/parser/webContentParser');
var selectorStage = require('./lib/stage/selectorStage');

var exports = {};

exports.parseContent = function (content, options, callback) {

  var optionLog = new OptionLog(options);
  var logLevel = optionLog.getOptionLogLevel();
//  var instance = optionLog.getLogInstance();

  if (logLevel !== null) {
    logger.changeLogLevel(logLevel);
  }

//  if (instance !== null) {
//    logger.changeLoggerInstance(instance);
//  }

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