const redux = require('../data/redux')

const ProjectMock = {
  findOne() {
    return Promise.resolve(redux)
  }
}

module.exports = ProjectMock
