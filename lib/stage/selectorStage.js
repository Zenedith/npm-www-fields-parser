var logger = require('../logger/logger').logger;
var StageError = require('../error/stageError').StageError;
var cheerio = require('cheerio');

var exports = {};

var isEmptySelector = function (selector) {
  return (selector.length < 1);
};

exports.context = function (content) {
  return cheerio.load(content, {
    normalizeWhitespace: true,
    xmlMode: true,
    decodeEntities: true
  });
};

exports.stage = function (content, options, callback) {
  logger.debug('selectorStage: ' + content);

  var $$ = options.context || exports.context(content);
  var selector = options.selector;
  var err = null;
  var result = null;

  if (!selector) {
    var msg = 'Missing "selector" option for selectorStage';
    logger.warning(msg);
    err = new StageError(msg);
    return callback(err, result);
  }

  var selectorValue = $$(selector);

  if (!isEmptySelector(selectorValue)) {
    result = selectorValue.text();
  }
  else {
    logger.info('Unable to find value for given selector: ' + selector);
  }

  return callback(err, result);

};

module.exports = exports;