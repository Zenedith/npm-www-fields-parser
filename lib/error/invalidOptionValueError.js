module.exports.InvalidOptionValueError = function InvalidOptionValueError(message) {
  Error.call(this);
  this.message = message;
};