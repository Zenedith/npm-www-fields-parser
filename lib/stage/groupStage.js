var async = require('async');
var assert = require('assert-plus');
var logger = require('../logger/logger').logger;
var AbstractStage = require('../stage/abstractStage').AbstractStage;
var selectorStage = require('../stage/selectorStage');

var exports = {};

exports.TYPE = 'group';

exports.GroupStage = function GroupStage(groupOptions) {
  AbstractStage.call(this);

  this.getName = function () {
    return exports.TYPE;
  };

  this.execute = function (value, options, callback) {
    logger.debug('Executing groupOptions stage');

    assert.object(groupOptions, 'groupOptions');
    assert.string(groupOptions.context, 'groupOptions.context');
    assert.string(groupOptions.elements, 'groupOptions.elements');
    assert.arrayOfObject(groupOptions.fields, 'groupOptions.fields');

    var tasks = [];

    var $$ = selectorStage.createContext(options.content);
    var selector = $$(groupOptions.context).children(groupOptions.elements);

    if (!selector || selector.length < 1) {
      logger.warn('Unable to handle group stage for empty selector results: ', groupOptions.context, groupOptions.elements);
      return callback(new Error('No group results'));
    }

    logger.debug('Found ' + selector.length + ' items');

    var stages = {};

    selector.each(function (item, elem) {

      var selectorTasks = [];

      logger.debug('Run preparation for selector item: ' + item);

      (function (item, elem) {
        var initFunc = function (cc) {
          logger.debug('Initiated first stage task.');
          return cc(null, $$(elem).html());
        };

        for (var i in groupOptions.fields) {
          if (groupOptions.fields.hasOwnProperty(i)) {
            var field = groupOptions.fields[i];

            assert.object(field, 'groupOptions.fields.[].field');
            assert.string(field.name, 'groupOptions.fields.[].field.name');
            assert.arrayOfObject(field.stages, 'groupOptions.fields.[].field.stages');

            logger.debug('Stages for field: ' + field.name);

            var fieldTasks = [initFunc];

            if (!stages.hasOwnProperty(field.name)) {
              var optionFields = require('../option/optionFields');
              stages[field.name] = optionFields.parseFieldSteps(field.stages, field.name);
            }

            for (var j in stages[field.name]) {
              if (stages[field.name].hasOwnProperty(j)) {
                var stage = stages[field.name][j];

                logger.debug('Prepare stage ' + j + ': ' + stage.getName());

                (function (j, stage) {
                  var func = function (value, callback) {
                    logger.debug('Initiated ' + j + ' stage for value: ' + value);
                    stage.execute(value, options, callback);
                  };

                  fieldTasks.push(func);
                }(j, stage));
              }
            }

            (function (item, field, fieldTasks) {
              var funcFields = function (cc) {
                logger.debug('Added async task for field: ' + field.name);

                async.waterfall(fieldTasks, function (err, result) {
                  logger.debug('async waterfall for fieldTasks completed with result: ', result);

                  if (err) {
                    return cc(err, null);
                  }

                  var response = {
                    name: field.name,
                    result: result
                  };

                  return cc(err, response);
                });
              };
              selectorTasks.push(funcFields);
            }(item, field, fieldTasks));
          }
        }
      })(item, elem);

      (function (item, selectorTasks) {
        var funcSelector = function (cc) {
          logger.debug('Added selector task for run : ' + item);

          async.parallel(selectorTasks, function (err, results) {
            logger.debug('async parallel for selectorTasks completed with results: ', results);

            return cc(err, results);
          });
        };
        tasks.push(funcSelector);
      }(item, selectorTasks));

    });

    async.parallel(tasks, function (err, results) {
      logger.debug('async waterfall completed with results: ', results);

      if (err) {
        return callback(err, null);
      }

      var response = [];

      results.forEach(function (array) {

        var item = {};
        array.forEach(function (elem) {
          if (Array.isArray(elem.result)) {
            item[elem.name] = elem.result.join(',');
          }
          else {
            item[elem.name] = elem.result;
          }
        });

        response.push(item);
      });

      return callback(err, response);
    });
  };

};

module.exports = exports;