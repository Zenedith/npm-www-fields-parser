var GroupStage = require('../../lib/stage/groupStage').GroupStage;
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;

describe('Group stage test', function () {

  it('should get value from group options', function (done) {

    var options = {
      content: '<html><table id="tasks">' +
        '<tr class="task"><td class="name" scope="row"><p>name of task</p></td><td class="image"><img src="/image.png" alt=""/></td><td class="description Task"><p class="Task">Task description</p></td><td class="socket"><p class="cs">Task socket</p></td><td class="file"><p class="fi">Task file</p></td></tr>' +
        '<tr class="task"><td class="name" scope="row"><p>name2 of task</p></td><td class="image"><img src="/image2.png" alt=""/></td><td class="description Task"><p class="Task">Task2 description</p></td><td class="once Task"><p class="oone">Task2 once</p></td></tr>' +
        '</table></html>'
    };

    var groupOptions = {
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
              opts: ['.image img', null, ['attr=src']]
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
    };

    var groupStage = new GroupStage(groupOptions);
    groupStage.execute(options.content, options, function (err, result) {
      should.not.exist(err);

      expect(result).to.have.length(2);
      expect(result).to.have.deep.property('[0].name', 'name of task');
      expect(result).to.have.deep.property('[0].image', '/image.png');
      expect(result).to.have.deep.property('[0].description', 'Task description');
      should.not.exist(result[0].once);
      expect(result).to.have.deep.property('[0].socket', 'Task socket');
      expect(result).to.have.deep.property('[0].file', 'Task file');
      should.not.exist(result[0].notexists);

      expect(result).to.have.deep.property('[1].name', 'name2 of task');
      expect(result).to.have.deep.property('[1].image', '/image2.png');
      expect(result).to.have.deep.property('[1].description', 'Task2 description');
      expect(result).to.have.deep.property('[1].once', 'Task2 once');
      should.not.exist(result[1].socket);
      should.not.exist(result[1].file);
      should.not.exist(result[1].notexists);

      done();
    });
  });

});