var logger = require('../logger/logger').logger;

var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();

var exports = {};

exports.stage = function (content, options, callback) {
  logger.debug('entitiesStage: ' + content);
  var decoded = entities.decode(content);
  return callback(null, decoded);
};

module.exports = exports;