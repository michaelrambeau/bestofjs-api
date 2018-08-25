const cors = require('cors')
const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')
const Cache = require('lru-cache-node')

const setupRoutes = require('./routes')

function createApp({ Project, Link, Review, port }) {
  const app = express(feathers())
  app.configure(express.rest())
  app.use(cors())
  const cache = new Cache()
  setupRoutes({ app, Project, Link, Review, cache })
  console.log('> API started, listening on port', port) // eslint-disable-line no-console
  app.listen(port)
  return app
}

module.exports = createApp