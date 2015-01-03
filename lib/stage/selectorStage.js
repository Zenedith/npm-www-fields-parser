var logger = require('../logger/logger').logger;
var StageError = require('../error/stageError').StageError;
var AbstractStage = require('../stage/abstractStage').AbstractStage;
var cheerio = require('cheerio');

var exports = {};

var CONTEXT_VAR = 'context';

var isEmptySelector = function (selector) {
  return selector.length < 1;
};

exports.TYPE = 'selector';

var createContext = function (content) {
  return cheerio.load(content, {
    normalizeWhitespace: true,
    xmlMode: true,
    decodeEntities: true
  });
};

exports.prepareContext = function (content) {
  logger.debug('prepare options');

  var options = {};
  options[exports.TYPE] = {};
  options[exports.TYPE][CONTEXT_VAR] = createContext(content);

  return options;
};

exports.SelectorStage = function SelectorStage(selector) {
  AbstractStage.call(this);
  this.selector = selector;

  this.getName = function () {
    return exports.TYPE;
  };

  this.execute = function (value, options, callback) {
    logger.debug('Executing selector stage for value');

    var $$ = options[exports.TYPE][CONTEXT_VAR];
    var err = null;
    var result = null;

    if (!this.selector) {
      err = new StageError('Missing "selector" for selectorStage');
      return callback(err, result);
    }

    var selectorValue = $$(this.selector);

    if (!isEmptySelector(selectorValue)) {
      result = selectorValue.text();
    }
    else {
      logger.info('Unable to find value for given selector: ' + this.selector);
    }

    return callback(err, result);
  };

  this.getSelector = function () {
    return this.selector;
  };
};

module.exports = exports;