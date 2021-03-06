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

  if (logLevel !== null) {
    logger.changeLogLevel(logLevel);
  }

  content = content.replace("\r", '');
  content = content.replace("\n", '');

  try {
    var parserOptions = {
      content: content
    };

    var fields = optionFields.getOptionFields(options);
    selectorStage.prepareContext(parserOptions, content);

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