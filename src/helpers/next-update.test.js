const {
  getNextUpdateDate,
  getNextUpdateTimeDifference
} = require('./next-update')

const dailyUpdateUTCHour = 21

const testCases = [
  // one minute before the daily update
  {
    now: '2018-08-26T20:59:00.000Z',
    next: '2018-08-26T21:00:00.000Z',
    difference: 60
  },
  // A few hours before
  {
    now: '2018-08-26T02:00:00.000Z',
    next: '2018-08-26T21:00:00.000Z',
    difference: 19 * 60 * 60
  },
  // Just one hour after the daily update
  {
    now: '2018-08-26T22:00:00.000Z',
    next: '2018-08-27T21:00:00.000Z',
    difference: 23 * 60 * 60
  }
]

test('It should compute the next update date', () => {
  testCases.forEach(({ now, next, difference }) => {
    const nextUpdate = getNextUpdateDate(new Date(now), dailyUpdateUTCHour)
    const timeDifference = getNextUpdateTimeDifference(
      new Date(now),
      dailyUpdateUTCHour
    )
    expect(nextUpdate.toISOString()).toBe(next)
    expect(timeDifference).toBeGreaterThan(0)
    expect(timeDifference).toBe(difference)
  })
})
