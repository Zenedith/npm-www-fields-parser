var async = require('async');
var logger = require('../logger/logger').logger;

var Result = require('../model/result').Result;
var ResultItem = require('..//model/resultItem').ResultItem;

var exports = {};

var executeStages = function (field, options, cb) {
  var name = field.getName();
  logger.debug('execute stages for field name:' + name);

  var stages = field.getStages();

  var tasks = [];
  tasks.push(function (cc) {
    logger.debug('Initiated first task.');
    return cc(null, null);
  });

  for (var i in stages) {
    if (stages.hasOwnProperty(i)) {
      var stage = stages[i];

      logger.debug('Prepare stage ' + i + ': ' + stage.getName());

      (function (i, stage) {
        var func = function (value, callback) {
          logger.debug('Initiated ' + i + ' stage.');
          stage.execute(value, options, callback);
        };

        tasks.push(func);
      }(i, stage));
    }
  }

  async.waterfall(tasks, function (err, result) {
    logger.debug('async waterfall completed with result: ' + result);
    var item = new ResultItem(name, result);
    return cb(null, item);
  });

};

var WebContentParser = function (options) {
  this.parseField = function (field, callback) {
    executeStages(field, options, callback);
  };

  this.parse = function (fields, callback) {
    var result = new Result();
    async.map(fields, this.parseField, function (err, results) {

      if (!err) {
        for (var i in results) {
          if (results.hasOwnProperty(i)) {
            var resultItem = results[i];

            if (resultItem) {
              result.addResultItem(resultItem);
            }
            else {
              logger.info('Invalid resultItem for field');
            }
          }
        }
      }
      else {
        logger.warning('Error on parse fields: ', err);
      }

      return callback(err, result);
    });
  };
};


exports.parse = function (options, fields, callback) {
  logger.debug('parse');

  if (!fields || fields.length < 1) {
    return callback(new Error('Missing fields to parse page content'));
  }

  var parser = new WebContentParser(options);
  return parser.parse(fields, callback);
};

module.exports = exports;