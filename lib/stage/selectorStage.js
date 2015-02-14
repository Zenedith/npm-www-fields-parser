var assert = require('assert-plus');
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

exports.createContext = function (content) {
  return cheerio.load(content, {
    normalizeWhitespace: true,
    xmlMode: true,
    decodeEntities: true
  });
};

exports.prepareContext = function (options, content) {
  assert.object(options, 'options');

  options[exports.TYPE] = {};
  options[exports.TYPE][CONTEXT_VAR] = exports.createContext(content);
};

exports.SelectorStage = function SelectorStage(selector, contextName) {
  AbstractStage.call(this);
  this.selector = selector;
  this.contextName = contextName;

  //default text handler
  this.handler = function () {
    return this.text();
  };

  var self = this;

  this.getName = function () {
    return exports.TYPE;
  };

  this.getSelector = function () {
    return this.selector;
  };

  this.val = function () {
    this.handler = function () {
      return this.val();
    };

    return self;
  };

  this.data = function () {
    this.handler = function () {
      return this.data();
    };

    return self;
  };

  this.html = function () {
    this.handler = function () {
      return this.html();
    };

    return self;
  };

  this.text = function () {
    this.handler = function () {
      return this.text();
    };

    return self;
  };

  this.attr = function (attrValue) {
    this.handler = function () {
      return this.attr(attrValue);
    };

    return self;
  };

  this.find = function (findValue) {
    this.handler = function () {
      return this.find(findValue);
    };

    return self;
  };

  this.parent = function () {
    this.handler = function () {
      return this.parent();
    };

    return self;
  };

  this.next = function () {
    this.handler = function () {
      return this.next();
    };

    return self;
  };

  this.prev = function () {
    this.handler = function () {
      return this.prev();
    };

    return self;
  };

  this.children = function (childrenValue) {
    this.handler = function () {
      return this.children(childrenValue);
    };

    return self;
  };

  this.execute = function (value, options, callback) {
    logger.debug('Executing selector stage with selector: ' + this.selector + ' for value: ' + value);

    assert.object(options, 'options');

    var err = null;
    var result = null;

    if (!this.selector) {
      err = new StageError('Missing "selector" for selectorStage');
      return callback(err, result);
    }

    if (value) {
      logger.debug('Use custom context for selector: ' + this.selector + ' for value: ' + value);
      exports.prepareContext(options, value);
    }

    assert.object(options[exports.TYPE], 'options.' + exports.TYPE);
    assert.func(options[exports.TYPE][CONTEXT_VAR], 'options.' + exports.TYPE + '.' + CONTEXT_VAR);
    var $$ = options[exports.TYPE][CONTEXT_VAR];

    if (this.contextName) {
      logger.debug('Executing selector: ' + this.selector + ' witch contextName: ' + this.contextName);
    }

    var selectorValue = $$(this.selector, this.contextName);

    if (!isEmptySelector(selectorValue)) {

      if (selectorValue.length < 2) {
        result = self.handler.bind(selectorValue)();
      }
      else {
        var result = [];

        selectorValue.each(function () {

          var val = self.handler.bind($$(this))();
          result.push(val);
        });
      }
    }
    else {
      logger.info('Unable to find value for given selector: ' + this.selector);
    }

    return callback(err, result);
  };

};

module.exports = exports;