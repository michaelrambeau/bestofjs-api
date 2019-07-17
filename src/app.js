const cors = require('cors')
const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const Cache = require('lru-cache')

const setupRoutes = require('./routes')

function createApp(models) {
  const app = express(feathers())
  app.configure(express.rest())
  app.use(cors())
  const appCache = {
    projectDetails: new Cache(),
    projectIds: new Cache()
  }
  setupRoutes({ app, appCache, ...models })
  return app
}

module.exports = createApp
