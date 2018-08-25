const cors = require('cors')
const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const Cache = require('lru-cache-node')

const setupRoutes = require('./routes')

function createApp({ Project, Link, Review }) {
  const app = express(feathers())
  app.configure(express.rest())
  app.use(cors())
  const cache = new Cache()
  setupRoutes({ app, Project, Link, Review, cache })
  return app
}

module.exports = createApp
