const Cache = require('lru-cache')

const sleep = ms => new Promise(r => setTimeout(r, ms))

// const Cache = require('lru-cache')
const cache = new Cache()

/*
This test has been added to check the behavior of the caching library
First we used `lru-cache-node` package but it does not behave the we way we expect in the application
because it resets the `max-age` counter every time we `get` data from the cache
as mentioned in the documentation
*/

test('Values should be cached for a given duration, `get` should not reset the counter', async () => {
  cache.set('A', 'a value', 30) //overwrites cache's default expiry of 10ms and uses 30ms
  await sleep(20)
  expect(cache.get('A')).toBe('a value')
  await sleep(20)
  expect(cache.get('A')).not.toBeDefined()
})
