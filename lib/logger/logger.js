var Log = require('log');
var logger = new Log(process.env.LOG_LEVEL || Log.ERROR, '');

module.exports.initLogger = function (logLevel) {
  console.log('ss');
  logger = new Log(logLevel, '');
};

module.exports.logger = new function () {
  this.emergency = function () {
    logger.log('EMERGENCY', arguments);
  };

  this.alert = function () {
    logger.log('ALERT', arguments);
  };

  this.critical = function () {
    logger.log('CRITICAL', arguments);
  };

  this.error = function () {
    logger.log('ERROR', arguments);
  };

  this.warning = function () {
    logger.log('WARNING', arguments);
  };

  this.notice = function () {
    logger.log('NOTICE', arguments);
  };

  this.info = function () {
    logger.log('INFO', arguments);
  };

  this.debug = function () {
    logger.log('DEBUG', arguments);
  };
};