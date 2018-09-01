const packageJson = require('../package.json')

// End-points to fetch project details (READONLY)
const createProjectDetailsService = require('./projects/details')

// End-points to fetch content created by the users (reviews and links)
const createLinksService = require('./projects/user-content/links-service')
const createReviewsService = require('./projects/user-content/reviews-service')

// The following end-point combines both `links` and `reviews` in the same response
const createUserContentService = require('./projects/user-content')
const createLookupService = require('./projects/lookup')
const makeHttpCaching = require('./http-caching')

const dailyUpdateUTCHour = 21

function setupRoutes({ app, appCache, Project, Link, Review }) {
  const { version, name, description } = packageJson
  const lookupService = createLookupService({
    cache: appCache.projectIds,
    Model: Project
  })
  const projectDetailsService = createProjectDetailsService({
    Project,
    cache: appCache.projectDetails,
    dailyUpdateUTCHour
  })
  const httpCaching = makeHttpCaching({ dailyUpdateUTCHour })
  const sendStatus = (req, res) =>
    res.send({ status: 'OK', name, version, description })

  const checkCache = (req, res) => {
    const showCacheKeys = cache => {
      const keyValues = cache.toArray()
      const count = keyValues.length
      const keys = keyValues.map(item => item.key).slice(0, 100)
      return { count, keys }
    }
    res.send({
      projectIds: showCacheKeys(appCache.projectIds),
      projectDetails: showCacheKeys(appCache.projectDetails)
    })
  }

  const LinksService = createLinksService({ lookupService, Model: Link })
  const ReviewsService = createReviewsService({ lookupService, Model: Review })

  app.use(
    '/projects/:owner/:repo/user-content',
    createUserContentService({ LinksService, ReviewsService })
  )
  app.use('/projects/:owner/:repo/links', LinksService)
  app.use('/projects/:owner/:repo/reviews', ReviewsService)
  app.use('/projects/:owner/:repo', httpCaching, projectDetailsService)
  app.use('/cache', checkCache)
  app.use('/', sendStatus)
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error('An error occurred!', err.stack) // eslint-disable-line no-console
    res.status(500).json({ status: 'error', message: err.message })
  })
}

module.exports = setupRoutes
