module.exports.ParseField = function ParseField(name, stages) {
  this.name = name;
  this.stages = stages;

  this.getName = function () {
    return this.name;
  };

  this.getStages = function () {
    return this.stages;
  };
};
