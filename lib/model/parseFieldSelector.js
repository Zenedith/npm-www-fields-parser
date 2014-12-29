module.exports.ParseFieldSelector = function ParseFieldSelector(selector) {
  this.selector = selector;

  this.getSelector = function () {
    return this.selector;
  };
};
