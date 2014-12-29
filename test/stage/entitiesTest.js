var entitiesStage = require('../../lib/stage/entitiesStage');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();

describe('Entities stage test', function () {

  it('should parse entities', function (done) {

    var str = '<>!@#$%^&*()_+';
    var content = entities.encode(str);
    var options = {
    };

    expect(content).to.equal('&lt;&gt;!@#$%^&amp;*()_+');

    entitiesStage.stage(content, options, function (err, result) {
      should.not.exist(err);
      expect(result).to.equal(str);
      done();
    });
  });

});