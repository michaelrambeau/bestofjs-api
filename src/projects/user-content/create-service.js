// const MongooseService = require('feathers-mongoose').Service
const debug = require('debug')('api')

function createUserContentService({ Model, projectField, lookupService }) {
  class UserContentService {
    async find({ query, route }) {
      const { owner, repo } = route
      const full_name = `${owner}/${repo}`
      const _id = await lookupService.getIdByFullname({ full_name })
      const searchQuery = { [projectField]: _id }
      // TODO: we lose the pagination feature by calling `Model.find()` instead of `super.find(params)`
      const doc = await Model.find(searchQuery)
      const populated = Model.populate(doc, {
        path: projectField,
        select: 'github.full_name'
      })
      return populated
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
