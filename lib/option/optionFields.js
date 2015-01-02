var OPTIONS_FIELDS_NAME = 'fields';
var OPTIONS_FIELD_NAME_VAR = 'name';
var OPTIONS_FIELD_STEPS_VAR = 'stages';
var OPTIONS_FIELD_STEPS__TYPE_VAR = 'type';

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

var exports = {};

var checkForMissingProperty = function (field, proprty) {

  if (!field.hasOwnProperty(proprty)) {
    throw new InvalidOptionFieldError('Missing field "' + proprty + '" property');
  }

  return field[proprty];
};

var verifyField = function (field) {

  if (!field) {
    throw new InvalidOptionFieldError('Field are empty');
  }

  checkForMissingProperty(field, OPTIONS_FIELD_NAME_VAR);
  checkForMissingProperty(field, OPTIONS_FIELD_STEPS_VAR);
};

var parseFields = function (optionsFields) {

  var fields = [];

  for (var i in optionsFields) {
    var field = optionsFields[i];

    verifyField(field);
    var name = field[OPTIONS_FIELD_NAME_VAR];
    var stages = parseFieldSteps(field[OPTIONS_FIELD_STEPS_VAR], name);

    if (stages.length > 0) {
      var parsedField = new ParseField(name, stages);
      fields.push(parsedField);
    }
    else {
      throw new InvalidOptionFieldError('Empty "' + OPTIONS_FIELD_STEPS_VAR + '" for options field property:' + name);
    }
  }

  return fields;
};

var parseFieldSteps = function (fieldSteps, fieldName) {

  var stages = [];

  for (var i in fieldSteps) {
    var step = fieldSteps[i];
    var fieldStage = null;

    checkForMissingProperty(step, OPTIONS_FIELD_STEPS__TYPE_VAR);

    var type = step[OPTIONS_FIELD_STEPS__TYPE_VAR];

    switch (type) {
      case STAGE_SELECTOR:
        var selector = checkForMissingProperty(step, 'selector');

        if (!selector) {
          throw new InvalidOptionFieldError('"Selector" step is empty for ' + fieldName);
        }

        fieldStage = new SelectorStage(selector);
        break;
      case STAGE_ENTITIES:
        fieldStage = new EntitiesStage();
        break;
      case STAGE_TRIM:
        fieldStage = new TrimStage();
        break;
    }

    if (fieldStage) {
      stages.push(fieldStage);
    }
    else {
      logger.warning('Unable to parse step ' + OPTIONS_FIELD_STEPS__TYPE_VAR + ': "' + type + '" for ' + fieldName);
    }
  }

  return stages;
};

exports.getOptionFields = function (options) {
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