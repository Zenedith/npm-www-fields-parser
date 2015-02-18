var OPTIONS_FIELDS_NAME = 'fields';
var OPTIONS_FIELD_NAME_VAR = 'name';
var OPTIONS_FIELD_STEPS_VAR = 'stages';
var OPTIONS_FIELD_STEPS_TYPE_VAR = 'type';
var OPTIONS_FIELD_STEPS_OPTS_VAR = 'opts';

//var assert = require('assert-plus');
var logger = require('../logger/logger').logger;
var InvalidOptionFieldError = require('../error/invalidOptionFieldError').InvalidOptionFieldError;
var InvalidOptionValueError = require('../error/invalidOptionValueError').InvalidOptionValueError;
var ParseField = require('../model/parseField').ParseField;
var selectorStage = require('../stage/selectorStage');
var SelectorStage = selectorStage.SelectorStage;
var STAGE_SELECTOR = selectorStage.TYPE;
var entitiesStage = require('../stage/entitiesStage');
var EntitiesStage = entitiesStage.EntitiesStage;
var STAGE_ENTITIES = entitiesStage.TYPE;
var trimStage = require('../stage/trimStage');
var TrimStage = trimStage.TrimStage;
var STAGE_TRIM = trimStage.TYPE;
var regexStage = require('../stage/regexStage');
var RegexStage = regexStage.RegexStage;
var STAGE_REGEX = regexStage.TYPE;
var groupStage = require('../stage/groupStage');
var GroupStage = groupStage.GroupStage;
var STAGE_GROUP = groupStage.TYPE;

var exports = {};

var checkForMissingProperty = function (field, property) {

  if (!field.hasOwnProperty(property)) {
    throw new InvalidOptionFieldError('Missing field "' + property + '" property');
  }

  return field[property];
};

var verifyField = function (field) {

  if (!field) {
    throw new InvalidOptionFieldError('Field are empty');
  }
  //TODO assert instead of checkForMissingProperty
  checkForMissingProperty(field, OPTIONS_FIELD_NAME_VAR);
  checkForMissingProperty(field, OPTIONS_FIELD_STEPS_VAR);
};

var createStage = function (type) {
  function F(args) {
    return type.apply(this, args[0]);
  }

  F.prototype = type.prototype;

  return function () {
    return new F(arguments);
  };
};

exports.parseFieldSteps = function parseFieldSteps(fieldSteps, fieldName) {

  var stages = [];

  for (var i in fieldSteps) {
    if (fieldSteps.hasOwnProperty(i)) {
      var step = fieldSteps[i];
      var fieldStage = null;

      checkForMissingProperty(step, OPTIONS_FIELD_STEPS_TYPE_VAR);

      var type = step[OPTIONS_FIELD_STEPS_TYPE_VAR];

      var opts = null;
      if (step.hasOwnProperty(OPTIONS_FIELD_STEPS_OPTS_VAR)) {
        opts = step[OPTIONS_FIELD_STEPS_OPTS_VAR];
      }

      switch (type) {
        case STAGE_SELECTOR:

          if (!opts || opts.length < 1) {
            throw new InvalidOptionFieldError('Missing opts field for stage selector');
          }

          fieldStage = createStage(SelectorStage)(opts);

          break;
        case STAGE_ENTITIES:
          fieldStage = createStage(EntitiesStage)(opts);
          break;
        case STAGE_TRIM:
          fieldStage = createStage(TrimStage)(opts);
          break;
        case STAGE_REGEX:
          if (!opts || opts.length < 1) {
            throw new InvalidOptionFieldError('Missing opts field for stage regex');
          }

          fieldStage = createStage(RegexStage)(opts);
          break;
        case STAGE_GROUP:
          if (!opts || opts.length < 1) {
            throw new InvalidOptionFieldError('Missing opts field for stage group');
          }

          fieldStage = createStage(GroupStage)(opts);
          break;
      }

      if (fieldStage) {
        stages.push(fieldStage);
      }
      else {
        logger.warn('Unable to parse step ' + OPTIONS_FIELD_STEPS_TYPE_VAR + ': "' + type + '" for ' + fieldName);
      }
    }
  }

  return stages;
};

var parseFields = function parseFields(optionsFields) {

  var fields = [];

  for (var i in optionsFields) {
    if (optionsFields.hasOwnProperty(i)) {
      var field = optionsFields[i];

      verifyField(field);
      var name = field[OPTIONS_FIELD_NAME_VAR];
      var stages = exports.parseFieldSteps(field[OPTIONS_FIELD_STEPS_VAR], name);

      if (stages.length > 0) {
        var parsedField = new ParseField(name, stages);
        fields.push(parsedField);
      }
      else {
        throw new InvalidOptionFieldError('Empty "' + OPTIONS_FIELD_STEPS_VAR + '" for options field property:' + name);
      }
    }
  }

  return fields;
};

exports.getOptionFields = function getOptionFields(options) {
  logger.debug('getOptionFields');

  if (!options.hasOwnProperty(OPTIONS_FIELDS_NAME)) {
    throw new InvalidOptionValueError('Missing "' + OPTIONS_FIELDS_NAME + '" options property');
  }

  var fields = parseFields(options[OPTIONS_FIELDS_NAME]);

  if (fields.length < 1) {
    throw new InvalidOptionValueError('Empty ' + OPTIONS_FIELDS_NAME + '" options property');
  }

  return fields;
};

module.exports = exports;