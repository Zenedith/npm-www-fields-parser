var logger = require('../logger/logger').logger;
var InvalidOptionFieldError = require('../error/invalidOptionFieldError').InvalidOptionFieldError;
var InvalidOptionValueError = require('../error/invalidOptionValueError').InvalidOptionValueError;
var ParseFieldSelector = require('../model/parseFieldSelector').ParseFieldSelector;
//var ParseField = require('../model/parseField').ParseField;

var exports = {};

var checkForMissingProperty = function (field, proprty) {

  if (!field.hasOwnProperty(proprty)) {
    throw new InvalidOptionFieldError('Missing field "' + proprty + '" property');
  }

  return field[proprty];
};

var verifyField = function (field) {

  if (!field) {
    throw new InvalidOptionFieldError('Field is empty');
  }

  checkForMissingProperty(field, 'name');
  checkForMissingProperty(field, 'type');
};

var parseFields = function (optionsFields) {

  var fields = [];

  for (var i in optionsFields) {
    var field = optionsFields[i];
    var fieldParser = null;

    verifyField(field);

    switch (field.type) {
      case 'selector':
        var selector = checkForMissingProperty(field, 'selector');

        if (!selector) {
          throw new InvalidOptionFieldError('"Selector" field is empty for ' + field.name);
        }

        fieldParser = new ParseFieldSelector(selector);
        break;
    }

    if (fieldParser) {
      fields.push(fieldParser);
    }
    else {
      logger.warning('Unable to parse field type: ' + field.type + ' for ' + field.name);
    }
  }

  return fields;
};

exports.getOptionFields = function (options) {
  logger.debug('getOptionFields');

  if (!options.hasOwnProperty('fields')) {
    throw new InvalidOptionValueError('Missing "fields" options property');
  }

  var fields = parseFields(options.fields);

  if (fields.length < 1) {
    throw new InvalidOptionValueError('Field is empty');
  }

  return fields;
};

module.exports = exports;