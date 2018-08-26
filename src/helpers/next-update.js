const { DateTime } = require('luxon')

function getNextUpdateDate(currentDate, dailyUpdateUTCHour) {
  const currentDateTime = DateTime.fromJSDate(currentDate)
  const currentUTCDateTime = currentDateTime.setZone('utc')
  const currentUTCHour = currentUTCDateTime.hour
  const deltaDay = currentUTCHour >= dailyUpdateUTCHour ? 1 : 0
  const date = DateTime.utc(
    currentUTCDateTime.year,
    currentUTCDateTime.month,
    currentUTCDateTime.day + deltaDay,
    dailyUpdateUTCHour,
    0
  ).toJSDate()
  return date
}

function getNextUpdateTimeDifference(currentDate, dailyUpdateUTCHour) {
  const nextUpdateDateTime = getNextUpdateDate(currentDate, dailyUpdateUTCHour)
  return parseInt((nextUpdateDateTime - currentDate) / 1000)
}

module.exports = {
  getNextUpdateDate,
  getNextUpdateTimeDifference
}
