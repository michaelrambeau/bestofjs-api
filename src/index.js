// Read secrets from `.env` file in local development mode
require('dotenv').config({ silent: true })
const debug = require('debug')('api')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

// Models
const Project = require('./models/Project')
const Link = require('./models/Link')
const Review = require('./models/Review')

const createApp = require('./app')

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
    throw new Error('Unable to connect to the DB', `${uri.slice(0, 12)}...`)
  }
  const port = process.env.PORT || 3030
  createApp({ Project, Link, Review, port })
}

main()
