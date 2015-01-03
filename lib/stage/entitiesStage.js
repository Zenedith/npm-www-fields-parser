var logger = require('../logger/logger').logger;
var AbstractStage = require('../stage/abstractStage').AbstractStage;

var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

var exports = {};

exports.TYPE = 'entities';

exports.EntitiesStage = function EntitiesStage() {
  AbstractStage.call(this);

  this.getName = function () {
    return exports.TYPE;
  };

  this.execute = function (value, options, callback) {
    logger.debug('Executing entities stage for: ' + value);

    var result = '';  //default empty string

    if (value) {
      result = entities.decode(value);
    }

    return callback(null, result);
  };
};

module.exports = exports;