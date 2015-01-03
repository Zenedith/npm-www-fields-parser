module.exports.InvalidOptionFieldError = function InvalidOptionFieldError(message) {
  Error.call(this);
  this.message = message;
};