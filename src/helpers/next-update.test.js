const Cache = require('lru-cache-node')

const {
  getNextUpdateDate,
  getNextUpdateTimeDifference,
  fetchIfNeeded
} = require('./next-update')

const dailyUpdateUTCHour = 21
const currentDate = new Date('2018-08-28T20:00:00.000Z')

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

test('The next update date should be a date', () => {
  const input = '2018-08-31T22:19:03.773Z'
  const nextUpdate = getNextUpdateDate(new Date(input), dailyUpdateUTCHour)
  const difference = getNextUpdateTimeDifference(
    new Date(input),
    dailyUpdateUTCHour
  )
  expect(nextUpdate).toBeInstanceOf(Date)
  expect(difference).toBeGreaterThan(0)
})

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

test('It should fetch data from the database', async () => {
  const key = 'redux'
  const data = 'Redux is great'
  const cache = new Cache()
  // const { now, difference } = testCases[0]
  testCases.forEach(async ({ now, difference }) => {
    const fetchFn = jest.fn().mockResolvedValue(data) // don't move it in the above scope
    const options = {
      fetchFn,
      key,
      currentDate: new Date(now),
      dailyUpdateUTCHour,
      cache
    }
    const firstResult = await fetchIfNeeded(options)
    expect(fetchFn).toBeCalledWith(key)
    expect(firstResult).toEqual({ data, meta: { fromCache: false } })
    const secondResult = await fetchIfNeeded(options)
    expect(fetchFn.mock.calls.length).toBe(1)
    expect(secondResult).toEqual({ data, meta: { fromCache: true } })
  })
})

test('It should fetch data from the cache', async () => {
  const key = 'redux'
  const fetchFn = jest.fn()
  const cache = new Cache()
  cache.set('redux', 'Redux is great')
  cache.set('react', 'React is great')
  // const cache = {
  //   get: jest.fn().mockReturnValue(data),
  //   set: jest.fn()
  // }
  const fetch = key =>
    fetchIfNeeded({
      fetchFn,
      key,
      currentDate,
      dailyUpdateUTCHour,
      cache
    })
  const firstResult = await fetch('redux')
  expect(fetchFn).not.toBeCalled()
  // expect(cache.get).toBeCalledWith(key)
  expect(firstResult).toEqual({
    data: 'Redux is great',
    meta: { fromCache: true }
  })
  const secondResult = await fetch('react')
  expect(fetchFn).not.toBeCalled()
  // expect(cache.get).toBeCalledWith(key)
  expect(secondResult).toEqual({
    data: 'React is great',
    meta: { fromCache: true }
  })
  const thirdResult = await fetch('redux')
  expect(fetchFn).not.toBeCalled()
  // expect(cache.get).toBeCalledWith(key)
  expect(thirdResult).toEqual({
    data: 'Redux is great',
    meta: { fromCache: true }
  })
})
