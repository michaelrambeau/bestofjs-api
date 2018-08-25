const createApp = require('../src/app')

const models = require('./models')

const port = process.env.PORT || 3030
const app = createApp(models)
console.log('> Test server started, listening on port', port) // eslint-disable-line no-console
app.listen(port)
