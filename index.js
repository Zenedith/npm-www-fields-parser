var logger = require('./lib/logger/logger').logger;
var optionFields = require('./lib/option/optionFields');
var webContentParser = require('./lib/parser/webContentParser');

var exports = {};

exports.parseContent = function (content, options, callback) {
  logger.debug('parseWWWContent');

  try {
    var fields = optionFields.getOptionFields(options);

    return webContentParser.parse(content, fields, function (err, results) {

      if (err) {
        logger.debug('Failed to parse content: ' + err);
      }

      return callback(err, results);
    });
  }
  catch (e) {
    return callback(e);
  }
};


module.exports = exports;