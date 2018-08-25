const createUserContentService = require('./create-service')
const debug = require('debug')('api')

const reviewsService = ({ lookupService, Model }) => {
  debug('Create the service', Model.modelName)
  return createUserContentService({
    lookupService,
    Model,
    projectField: 'project'
  })
}

module.exports = reviewsService
