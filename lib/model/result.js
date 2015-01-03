module.exports.Result = function Result(results) {
  this.results = results || [];

  this.addResultItem = function (resultItem) {
    this.results.push(resultItem);
  };

  this.getResults = function () {
    return this.results;
  };
};
