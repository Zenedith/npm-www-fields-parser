var logger = require('../logger/logger').logger;

var exports = {};

exports.stage = function (content, options, callback) {
  logger.debug('trimStage: ' + content);

  var result = null;

  if (content) {
    result = content.trim()
  }

  return callback(null, result);
};

module.exports = exports;