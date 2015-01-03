var index = require('../index');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('index test', function () {

  it('should return error on empty fields', function (done) {

    var content = '';
    var options = {
    };

    index.parseContent(content, options, function (err, results) {
      should.exist(err);
      should.not.exist(results);
      done();
    });
  });

  it('should parse result using stages', function (done) {

    var content = '<div id="id"> value &lt;&gt;</div>';
    var options = {
      fields: [
        {
          name: 'id_selector_with_entities_and_trim_stages',
          stages: [
            {
              type: 'selector',
              selector: '#id'
            },
            {
              type: 'entities'
            },
            {
              type: 'trim'
            }
          ]
        }
      ]
    };

    index.parseContent(content, options, function (err, result) {
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