// Read secrets from `.env` file in local development mode
require('dotenv').config({ silent: true })
const debug = require('debug')('api')
const cors = require('cors')
const mongoose = require('mongoose')
const Cache = require('lru-cache-node')
const feathers = require('@feathersjs/feathers')
const express = require('@feathersjs/express')

const packageJson = require('../package.json')

// Models
const Project = require('./models/Project')

// End-points to fetch project details (READONLY)
const projectDetailsService = require('./projects/details')

// End-points to fetch content created by the users (reviews and links)
const createLinksService = require('./projects/user-content/links-service')
const createReviewsService = require('./projects/user-content/reviews-service')

// The following end-point combines both `links` and `reviews` in the same response
const createUserContentService = require('./projects/user-content')
const createLookupService = require('./projects/lookup')

mongoose.Promise = global.Promise

function connect(uri) {
  debug('Connecting', `${uri.slice(0, 12)}...`)
  mongoose.connect(uri, { useMongoClient: true })
}
function main() {
  const { version, name, description } = packageJson
  const dbEnv = process.env.DB_ENV || 'DEV'
  const key = `MONGO_URI_${dbEnv.toUpperCase()}`
  const uri = process.env[key]
  if (!uri) throw new Error(`No env. variable '${key}'`)
  const cache = new Cache()
  const lookupService = createLookupService({ cache, Model: Project })
  console.log('> Start the API', key) // eslint-disable-line no-console
  try {
    connect(uri)
  } catch (e) {
    throw new Error('Unable to connect to the DB', `${uri.slice(0, 12)}...`)
  }

  const app = express(feathers())
  app.configure(express.rest())
  app.use(cors())

  const sendStatus = (req, res) =>
    res.send({ status: 'OK!', name, version, description })

  const checkCache = (req, res) => {
    const keyValues = cache.toArray()
    const count = keyValues.length
    const keys = keyValues.map(item => item.key).slice(0, 100)
    res.send({ count, keys })
  }

  const LinksService = createLinksService({ lookupService, Model: Project })
  const ReviewsService = createReviewsService({ lookupService, Model: Project })

  app.use(
    '/projects/:owner/:repo/user-content',
    createUserContentService({ LinksService, ReviewsService })
  )
  app.use('/projects/:owner/:repo/links', LinksService)
  app.use('/projects/:owner/:repo/reviews', ReviewsService)
  app.use('/projects/:owner/:repo', projectDetailsService)
  app.use('/cache', checkCache)
  app.use('/', sendStatus)
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('An error occurred!', err.stack) // eslint-disable-line no-console
    res.status(500).json({ status: 'error', message: err.message })
  })

  const port = process.env.PORT || 3030

  console.log('> API started, listening on port', port) // eslint-disable-line no-console
  app.listen(port)
}

main()
