// Read secrets from `.env` file in local development mode
require('dotenv').config({ silent: true })
const debug = require('debug')('api')
const packageJson = require('../package.json')

const feathers = require('feathers')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const cors = require('cors')
const mongoose = require('mongoose')

// End-points to fetch project details (READONLY)
// const projectsService = require('./projects/projects-service') // for admin only
const projectDetailsService = require('./projects/details')

// End-points to fetch content created by the users (reviews and links)
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
  const { version, name, description } = packageJson
  const dbEnv = process.env.DB_ENV || 'DEV'
  const key = `MONGO_URI_${dbEnv.toUpperCase()}`
  const uri = process.env[key]
  if (!uri) throw new Error(`No env. variable '${key}'`)
  console.log('> Start the API', key) // eslint-disable-line no-console
  try {
    connect(uri)
  } catch (e) {
    throw new Error('Unable to connect to the DB', `${uri.slice(0, 12)}...`)
  }

  const app = feathers()

  app.configure(rest()).configure(hooks()).use(cors())

  const sendStatus = (req, res) =>
    res.send({ status: 'OK', name, version, description })
  app.use('/projects/:owner/:repo/user-content', userContentService)
  app.use('/projects/:owner/:repo/links', linksService)
  app.use('/projects/:owner/:repo/reviews', reviewsService)
  app.use('/projects/:owner/:repo', projectDetailsService)
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
