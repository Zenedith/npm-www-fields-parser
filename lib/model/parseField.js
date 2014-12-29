module.exports.ParseField = function ParseField(name, steps) {
  this.name = name;
  this.steps = steps;

  this.getName = function () {
    return this.name;
  };

  this.getSteps = function () {
    return this.steps;
  };
};
