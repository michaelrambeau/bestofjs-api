const MongooseService = require('feathers-mongoose').Service
const Project = require('../../models/Project')
const debug = require('debug')('api')

function createUserContentService({ Model, projectField }) {
  class UserContentService extends MongooseService {
    find(params) {
      const { owner, repo } = params
      const full_name = `${owner}/${repo}`
      debug('Search for', full_name, Model.modelName)
      return Project.findOne({
        'github.full_name': full_name
      })
        .select({ _id: 1, name: 1 })
        .then(project => {
          if (!project) throw new Error(`No project found ${full_name}`)
          const { _id } = project
          const query = { [projectField]: _id }
          params.query = query
          // TODO: we lose the pagination feature by calling `Model.find()` instead of `super.find(params)`
          return Model.find(query)
            .populate(projectField, 'github.full_name')
            .exec()
        })
    }
    get(id, params) {
      return super.get(id, params)
    }
  }
  const service = new UserContentService({
    Model,
    paginate: {
      default: 50,
      max: 100
    }
  })
  return service
}

module.exports = createUserContentService
