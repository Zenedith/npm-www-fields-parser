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

exports.SelectorStage = function SelectorStage(selector, contextName, handlers) {
  AbstractStage.call(this);
  this.selector = selector;
  this.contextName = contextName;
  this.handlers = [];

  handlers = handlers || [];

  if (typeof handlers === 'string') {
    handlers = [handlers];
  }

  var self = this;

  this.getName = function () {
    return exports.TYPE;
  };

  this.getSelector = function () {
    return this.selector;
  };

  this.val = function val() {
    this.handlers.push(function () {
      return this.val();
    });

    return self;
  };

  this.data = function data() {
    this.handlers.push(function () {
      return this.data();
    });

    return self;
  };

  this.html = function html() {
    this.handlers.push(function () {
      return this.html();
    });

    return self;
  };

  this.text = function text() {
    this.handlers.push(function () {
      return this.text();
    });

    return self;
  };

  this.attr = function attr(attrValue) {
    this.handlers.push(function () {
      return this.attr(attrValue);
    });

    return self;
  };

  this.find = function find(findValue) {
    this.handlers.push(function () {
      return this.find(findValue);
    });

    return self;
  };

  this.parent = function parent() {
    this.handlers.push(function () {
      return this.parent();
    });

    return self;
  };

  this.next = function next() {
    this.handlers.push(function () {
      return this.next();
    });

    return self;
  };

  this.prev = function prev() {
    this.handlers.push(function () {
      return this.prev();
    });

    return self;
  };

  this.children = function children(childrenValue) {
    this.handlers.push(function () {
      return this.children(childrenValue);
    });

    return self;
  };

  this.last = function last() {
    this.handlers.push(function last() {
      return this.last();
    });

    return self;
  };

  //default text handler
  if (handlers) {
    var re = /(.+)=(.+)/;

    for (var i in handlers) {
      if (handlers.hasOwnProperty(i)) {
        var handler = handlers[i];

        var value = undefined;
        var matches = handler.match(re);

        if (matches) {
          value = matches[2];
          handler = matches[1];
        }

        switch (handler) {
          case 'html' :
            this.html();
            break;
          case 'val' :
            this.val();
            break;
          case 'data' :
            this.data();
            break;
          case 'attr' :
            this.attr(value);
            break;
          case 'find' :
            this.find(value);
            break;
          case 'parent' :
            this.parent();
            break;
          case 'next' :
            this.next();
            break;
          case 'prev' :
            this.prev();
            break;
          case 'children' :
            this.children();
            break;
          case 'last' :
            this.last();
            break;
          default:
//            this.text();
        }
      }
    }
  }

  if (!this.handlers || this.handlers.length < 1) {
    this.text();
  }

  assert.arrayOfFunc(this.handlers, 'this.handlers');

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
      var size = this.handlers.length;
      var handler = null;

      if (size > 1) {
        for (var i in this.handlers) {
          if (this.handlers.hasOwnProperty(i)) {
            handler = this.handlers[i];

            if (i < size - 1) {
              selectorValue = handler.bind(selectorValue)();
            }
          }
        }
      }

      handler = this.handlers[size - 1];
      assert.func(handler, 'handler');

      if (selectorValue.length < 2) {
        result = handler.bind(selectorValue)();
      }
      else {
        var result = [];

        selectorValue.each(function () {

          var val = handler.bind($$(this))();
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