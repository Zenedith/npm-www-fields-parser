var Log = require('log');
var logger = new Log(process.env.LOG_LEVEL || Log.ERROR, '');

module.exports.initLogger = function (logLevel) {
  logger = new Log(logLevel, '');
};

module.exports.logger = new function () {
  this.emergency = function (msg) {
    logger.log('EMERGENCY', arguments);
  };

  this.alert = function (msg) {
    logger.log('ALERT', arguments);
  };

  this.critical = function (msg) {
    logger.log('CRITICAL', arguments);
  };

  this.error = function (msg) {
    logger.log('ERROR', arguments);
  };

  this.warning = function (msg) {
    logger.log('WARNING', arguments);
  };

  this.notice = function (msg) {
    logger.log('NOTICE', arguments);
  };

  this.info = function (msg) {
    logger.log('INFO', arguments);
  };

  this.debug = function (msg) {
    logger.log('DEBUG', arguments);
  };
};