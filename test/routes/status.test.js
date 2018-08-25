const request = require('supertest')

const app = require('../create-test-app')

test('It should return the status OK', async () => {
  const response = await request(app)
    .get('/status')
    .expect('Content-Type', /json/)
    .expect(200)
  const { body } = response
  const { links, reviews } = body
  expect(body).toHaveProperty('status', 'OK')
})
