const MongooseService = require('feathers-mongoose').Service
const debug = require('debug')('api')

function createUserContentService({ Model, projectField, lookupService }) {
  class UserContentService extends MongooseService {
    async find(params) {
      const { owner, repo } = params
      const full_name = `${owner}/${repo}`
      const _id = await lookupService.getIdByFullname({ full_name })
      const query = { [projectField]: _id }
      params.query = query
      // TODO: we lose the pagination feature by calling `Model.find()` instead of `super.find(params)`
      return Model.find(query).populate(projectField, 'github.full_name').exec()
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
