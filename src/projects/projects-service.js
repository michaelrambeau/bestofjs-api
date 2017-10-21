const MongooseService = require('feathers-mongoose').Service
const Model = require('../models/Project')

// All models have to be registered
require('../models/Tag')
require('../models/Snapshot')

class ProjectService extends MongooseService {
  find(params) {
    return super.find(params)
  }
  get(id, params) {
    const { owner, repo } = params
    const full_name = `${owner}/${repo}`
    return super.get(id)
  }
}

const service = new ProjectService({
  Model,
  paginate: {
    default: 10,
    max: 20
  }
})

module.exports = service
