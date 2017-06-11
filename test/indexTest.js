var index = require('../index');
var logger = require('../lib/logger/logger');
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

  it('should parse result using selector stages', function (done) {

    var content = '<div id="id"> value &lt;&gt;</div>';
    var options = {
      fields: [
        {
          name: 'id_selector_with_entities_and_trim_stages',
          stages: [
            {
              type: 'selector',
              opts: ['#id']
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
      expect(results).to.be.not.empty;
      should.exist(results[0]);
      expect(results[0].getName()).to.equal('id_selector_with_entities_and_trim_stages');
      expect(results[0].getValue()).to.equal('value <>');
      done();
    });
  });

  it('should use val handler for selector', function (done) {

    var content = '<input id="id" value="val">value</input>';
    var options = {
      fields: [
        {
          name: 'input_id_selector',
          stages: [
            {
              type: 'selector',
              opts: ['#id', null, 'val']
            }
          ]
        }
      ]
    };

    index.parseContent(content, options, function (err, result) {
      should.exist(result);
      var results = result.getResults();
      expect(results).to.be.not.empty;
      should.exist(results[0]);
      expect(results[0].getName()).to.equal('input_id_selector');
      expect(results[0].getValue()).to.equal('val');
      done();
    });
  });

  it('should use last val handler for selector', function (done) {

    var content = '<input class="class" value="vala">value</input><input class="class" value="las">last</input>';
    var options = {
      fields: [
        {
          name: 'input_last_class_selector',
          stages: [
            {
              type: 'selector',
              opts: ['.class', null, ['last', 'val']]
            }
          ]
        }
      ]
    };

    index.parseContent(content, options, function (err, result) {
      should.exist(result);
      var results = result.getResults();
      expect(results).to.be.not.empty;
      should.exist(results[0]);
      expect(results[0].getName()).to.equal('input_last_class_selector');
      expect(results[0].getValue()).to.equal('las');
      done();
    });
  });

  it('should use val handler for selector', function (done) {

    var content = '<input class="class" value="vala">value</input><input class="class" value="las">last</input>';
    var options = {
      fields: [
        {
          name: 'input_class_selector',
          stages: [
            {
              type: 'selector',
              opts: ['.class', null, 'val']
            }
          ]
        }
      ]
    };

    index.parseContent(content, options, function (err, result) {
      should.exist(result);
      var results = result.getResults();
      expect(results).to.be.not.empty;
      should.exist(results[0]);
      expect(results[0].getName()).to.equal('input_class_selector');
      expect(results[0].getValue()).to.be.not.empty;
      expect(results[0].getValue()[0]).to.equal('vala');
      expect(results[0].getValue()[1]).to.equal('las');
      done();
    });
  });

  it('should use attr handler for selector', function (done) {

    var content = '<img src="/image.png" alt=""/>';
    var options = {
      fields: [
        {
          name: 'img_src_attr',
          stages: [
            {
              type: 'selector',
              opts: ['img', null, 'attr=src']
            }
          ]
        }
      ]
    };

    index.parseContent(content, options, function (err, result) {
      should.exist(result);
      var results = result.getResults();
      expect(results).to.be.not.empty;
      should.exist(results[0]);
      expect(results[0].getName()).to.equal('img_src_attr');
      expect(results[0].getValue()).to.equal('/image.png');
      done();
    });
  });

  it('should parse result using regex stages', function (done) {

    var content = '<html><p><span>Engine power: </span> <strong> <span class="value"> &lt;&gt; 55 kW &lt;&gt; </span> </strong></p></html>';
    var options = {
      fields: [
        {
          name: 'id_regex_stages',
          stages: [
            {
              type: 'regex',
              opts: ['<.+>Engine power: </.+>.+<.+ class="value">(.+?)</.+>']
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
      expect(results).to.have.length(1);

      should.exist(results[0]);
      expect(results[0].getName()).to.equal('id_regex_stages');
      expect(results[0].getValue()).to.equal('<> 55 kW <>');
      done();
    });
  });

  it('should parse result using group stages', function (done) {

    var content = '<html><table id="tasks">' +
      '<tr class="task"><td class="name" scope="row"><p>name of task</p></td><td class="image"><img src="/image.png" alt=""/></td><td class="description Task"><p class="Task">Task description</p></td><td class="socket"><p class="cs">Task socket</p></td><td class="file"><p class="fi">Task file</p></td></tr>' +
      '<tr class="task"><td class="name" scope="row"><p>name2 of task</p></td><td class="image"><img src="/image2.png" alt=""/></td><td class="description Task"><p class="Task">Task2 description</p></td><td class="once Task"><p class="oone">Task2 once</p></td></tr>' +
      '</table></html>';

    var options = {
      fields: [
        {
          name: 'id_group_stages',
          stages: [
            {
              type: 'group',
              opts: [
                {
                  context: '#tasks',
                  elements: '.task',
                  fields: [
                    {
                      name: 'name',
                      stages: [
                        {
                          type: 'selector',
                          opts: ['.name p']
                        }
                      ]
                    },
                    {
                      name: 'image',
                      stages: [
                        {
                          type: 'selector',
                          opts: ['.image img', null, 'attr=src']
                        }
                      ]
                    },
                    {
                      name: 'description',
                      stages: [
                        {
                          type: 'selector',
                          opts: ['.description p']
                        }
                      ]
                    },
                    {
                      name: 'once',
                      stages: [
                        {
                          type: 'selector',
                          opts: ['.once']
                        }
                      ]
                    },
                    {
                      name: 'socket',
                      stages: [
                        {
                          type: 'selector',
                          opts: ['.socket']
                        }
                      ]
                    },
                    {
                      name: 'file',
                      stages: [
                        {
                          type: 'selector',
                          opts: ['.file']
                        }
                      ]
                    },
                    {
                      name: 'notexists',
                      stages: [
                        {
                          type: 'selector',
                          opts: ['.notexists']
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };

    index.parseContent(content, options, function (err, result) {
      should.exist(result);
      var results = result.getResults();
      expect(results).to.have.length(1);
      should.exist(results[0]);
      expect(results[0].getName()).to.equal('id_group_stages');
      var value = results[0].getValue();

      expect(value).to.have.length(2);
      expect(value).to.have.nested.property('[0].name', 'name of task');
      expect(value).to.have.nested.property('[0].image', '/image.png');
      expect(value).to.have.nested.property('[0].description', 'Task description');
      should.not.exist(value[0].once);
      expect(value).to.have.nested.property('[0].socket', 'Task socket');
      expect(value).to.have.nested.property('[0].file', 'Task file');
      should.not.exist(value[0].notexists);

      expect(value).to.have.nested.property('[1].name', 'name2 of task');
      expect(value).to.have.nested.property('[1].image', '/image2.png');
      expect(value).to.have.nested.property('[1].description', 'Task2 description');
      expect(value).to.have.nested.property('[1].once', 'Task2 once');
      should.not.exist(value[1].socket);
      should.not.exist(value[1].file);
      should.not.exist(value[1].notexists);
      done();
    });
  });
});