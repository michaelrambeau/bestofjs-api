const { DateTime } = require('luxon')

/*
From a given date, and the number of hours of a daily process,
return the date when the data will be updated
*/
function getNextUpdateDate(currentDate, dailyUpdateUTCHour) {
  const currentDateTime = DateTime.fromJSDate(currentDate)
  const currentUTCDateTime = currentDateTime.setZone('utc')
  const todayUpdateUTCDateTime = DateTime.utc(
    currentUTCDateTime.year,
    currentUTCDateTime.month,
    currentUTCDateTime.day,
    dailyUpdateUTCHour,
    0
  )
  const diff = currentUTCDateTime.diff(todayUpdateUTCDateTime)
  const alreadyUpdated = diff.milliseconds > 0
  const nextUpdateUTCDateTime = todayUpdateUTCDateTime.plus({
    days: alreadyUpdated ? 1 : 0
  })
  const date = nextUpdateUTCDateTime.toJSDate()
  return date
}

/*
Return the number of seconds between a given date and the next time a daily process occurs
Used to set up `max-age` property of HTTP responses.
*/
function getNextUpdateTimeDifference(currentDate, dailyUpdateUTCHour) {
  const nextUpdateDateTime = getNextUpdateDate(currentDate, dailyUpdateUTCHour)
  return parseInt((nextUpdateDateTime - currentDate) / 1000)
}

async function fetchIfNeeded({
  fetchFn,
  key,
  currentDate,
  dailyUpdateUTCHour,
  cache
}) {
  const cachedValue = cache.get(key)
  const fromCache = !!cachedValue
  const fetchAndUpdateCache = async () => {
    const value = await fetchFn(key)
    const maxAge = getNextUpdateTimeDifference(currentDate, dailyUpdateUTCHour)
    cache.set(key, value, maxAge * 1000) // expects milliseconds
    return value
  }
  const data = await (cachedValue || fetchAndUpdateCache())
  const meta = { fromCache }
  return { data, meta }
}

module.exports = {
  getNextUpdateDate,
  getNextUpdateTimeDifference,
  fetchIfNeeded
}
