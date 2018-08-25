const models = require('./models')
const createApp = require('../src/app')

const isDate = d => /\d{4}-\d{2}-\d{2}T/.test(d)

expect.extend({
  toBeDate(received) {
    const pass = isDate(received)
    return {
      message: () => `expected ${received} to be a valid date`,
      pass
    }
  }
})

const app = createApp(models)

module.exports = app
