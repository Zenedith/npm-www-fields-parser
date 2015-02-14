var webContentParser = require('../../lib/parser/webContentParser');
var ParseField = require('../../lib/model/parseField').ParseField;
var TrimStage = require('../../lib/stage/trimStage').TrimStage;
var EntitiesStage = require('../../lib/stage/entitiesStage').EntitiesStage;
var selectorStage = require('../../lib/stage/selectorStage');
var SelectorStage = selectorStage.SelectorStage;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var content = '<div id="id"> value &lt;&gt;</div>';

describe('web content parser test', function () {

  it('should return error on empty fields', function (done) {

    var fields = [];
    var options = {
    };

    webContentParser.parse(options, fields, function (err, results) {
      console.log(err);
      should.exist(err);
      should.not.exist(results);
      done();
    });
  });

  it('should parse result using stages', function (done) {

    var fields = [
      new ParseField('id_selector_with_entities_and_trim_stages',
        [
          new SelectorStage('#id'),
          new EntitiesStage(),
          new TrimStage()
        ]
      )
    ];

    var options = {};
    selectorStage.prepareContext(options, content);

    webContentParser.parse(options, fields, function (err, result) {
      should.exist(result);
      var results = result.getResults();
      expect(results).to.be.not.empty();
      should.exist(results[0]);
      expect(results[0].getName()).to.equal('id_selector_with_entities_and_trim_stages');
      expect(results[0].getValue()).to.equal('value <>');
      done();
    });
  });
});