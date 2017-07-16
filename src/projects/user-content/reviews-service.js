const Model = require('../../models/Review')
const createUserContentService = require('./create-service')

const reviewsService = createUserContentService({
  Model,
  projectField: 'project'
})

module.exports = reviewsService
