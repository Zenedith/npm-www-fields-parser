module.exports.StageError = function StageError(message) {
  Error.call(this);
  this.message = message;
};