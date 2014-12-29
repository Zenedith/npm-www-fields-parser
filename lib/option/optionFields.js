var OPTIONS_FIELDS_NAME = 'fields';
var OPTIONS_FIELD_NAME_VAR = 'name';
var OPTIONS_FIELD_STEPS_VAR = 'steps';
var OPTIONS_FIELD_STEPS__TYPE_VAR = 'type';

var logger = require('../logger/logger').logger;
var InvalidOptionFieldError = require('../error/invalidOptionFieldError').InvalidOptionFieldError;
var InvalidOptionValueError = require('../error/invalidOptionValueError').InvalidOptionValueError;
var ParseFieldSelector = require('../model/parseFieldSelector').ParseFieldSelector;
var ParseField = require('../model/parseField').ParseField;

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
    var steps = parseFieldSteps(field[OPTIONS_FIELD_STEPS_VAR], name);

    if (steps.length > 0) {
      var parsedField = new ParseField(name, steps);
      fields.push(parsedField);
    }
    else {
      throw new InvalidOptionFieldError('Empty "' + OPTIONS_FIELD_STEPS_VAR + '" for options field property:' + name);
    }
  }

  return fields;
};

var parseFieldSteps = function (fieldSteps, fieldName) {

  var steps = [];

  for (var i in fieldSteps) {
    var step = fieldSteps[i];
    var fieldStepParser = null;

    checkForMissingProperty(step, OPTIONS_FIELD_STEPS__TYPE_VAR);

    var type = step[OPTIONS_FIELD_STEPS__TYPE_VAR];

    switch (type) {
      case 'selector':
        var selector = checkForMissingProperty(step, 'selector');

        if (!selector) {
          throw new InvalidOptionFieldError('"Selector" step is empty for ' + fieldName);
        }

        fieldStepParser = new ParseFieldSelector(selector);
        break;
    }

    if (fieldStepParser) {
      steps.push(fieldStepParser);
    }
    else {
      logger.warning('Unable to parse step ' + OPTIONS_FIELD_STEPS__TYPE_VAR + ': "' + type + '" for ' + fieldName);
    }
  }

  return steps;
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