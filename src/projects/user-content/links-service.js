const Model = require('../../models/Link')
const createUserContentService = require('./create-service')

const linksService = createUserContentService({
  Model,
  projectField: 'projects'
})

module.exports = linksService
