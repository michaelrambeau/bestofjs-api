const debug = require('debug')('caching')
const { getNextUpdateTimeDifference } = require('./helpers/next-update')

const caching = (req, res, done) => {
  const now = new Date()
  const dailyUpdateUTCHour = 21
  const nextUpdateTimeDifference = getNextUpdateTimeDifference(
    now,
    dailyUpdateUTCHour
  )
  debug('Next update', nextUpdateTimeDifference)
  res.set({ 'Cache-Control': `public, max-age=${nextUpdateTimeDifference}` })
  done()
}

module.exports = caching
