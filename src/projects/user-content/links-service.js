const Model = require('../../models/Link')
const createUserContentService = require('./create-service')
const debug = require('debug')('api')

const createLinksService = ({ lookupService }) => {
  debug('Create the service', Model.modelName)
  return createUserContentService({
    lookupService,
    Model,
    projectField: 'projects'
  })
}

module.exports = createLinksService
