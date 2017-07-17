// Read secrets from `.env` file in local development mode
require('dotenv').config({ silent: true })
const debug = require('debug')('api')

const feathers = require('feathers')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const cors = require('cors')
// const handler = require('feathers-errors/handler')
const mongoose = require('mongoose')

// "User Content" end points
const linksService = require('./projects/user-content/links-service')
const reviewsService = require('./projects/user-content/reviews-service')
// The following end-point combines both `links` and `reviews` in the same response
const userContentService = require('./projects/user-content')

mongoose.Promise = global.Promise

function connect(uri) {
  debug('Connecting', `${uri.slice(0, 12)}...`)
  mongoose.connect(uri, { useMongoClient: true })
}
function main() {
  const dbEnv = process.env.DB_ENV || 'DEV'
  const key = `MONGO_URI_${dbEnv.toUpperCase()}`
  const uri = process.env[key]
  if (!uri) throw new Error(`No env. variable '${key}'`)
  console.log('> Start the API', key) // eslint-disable-line no-console
  try {
    connect(uri)
  } catch (e) {
    throw new Error('Unable to connect to the DB', uri)
  }

  const app = feathers()

  app.configure(rest()).configure(hooks()).use(cors())

  app.use('/status', (req, res) => {
    res.send({ status: 'OK' })
  })
  app.use('/projects/:owner/:repo/links', linksService)
  app.use('/projects/:owner/:repo/reviews', reviewsService)
  app.use('/projects/:owner/:repo/user-content', userContentService)
  // app.use(handler())

  const port = process.env.PORT || 3030

  console.log('> API started, listening on port', port) // eslint-disable-line no-console
  app.listen(port)
}

main()
