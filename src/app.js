const cors = require('cors')
const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const Cache = require('lru-cache')

const setupRoutes = require('./routes')

function createApp({ Project, Link, Review }) {
  const app = express(feathers())
  app.configure(express.rest())
  app.use(cors())
  const appCache = {
    projectDetails: new Cache(),
    projectIds: new Cache()
  }
  setupRoutes({ app, Project, Link, Review, appCache })
  return app
}

module.exports = createApp
