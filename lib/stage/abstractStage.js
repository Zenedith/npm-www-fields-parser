var exports = {};

exports.AbstractStage = function AbstractStage() {

  this.getName = function () {
    throw new Error('AbstractStage.getName');
  };

  this.execute = function (value, options, callback) {
    return callback(new Error('AbstractStage.execute'));
  };
};

module.exports = exports;