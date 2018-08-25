const createUserContentService = require('./create-service')
const debug = require('debug')('api')

const createLinksService = ({ lookupService, Model }) => {
  debug('Create the service', Model.modelName)
  return createUserContentService({
    lookupService,
    Model,
    projectField: 'projects'
  })
}

module.exports = createLinksService
