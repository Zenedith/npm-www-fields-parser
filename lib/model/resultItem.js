module.exports.ResultItem = function ResultItem(name, value) {
  this.name = name;
  this.value = value;

  this.getName = function () {
    return this.name;
  };

  this.getValue = function () {
    return this.value;
  };
};
