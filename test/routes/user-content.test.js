const request = require('supertest')

const app = require('../create-test-app')

test('It should return the "links" and the "reviews" about `Redux` project', async () => {
  const response = await request(app)
    .get('/projects/reduxjs/redux/user-content')
    .expect('Content-Type', /json/)
    .expect(200)
  const { body } = response
  const { links, reviews } = body
  expect(body).toHaveProperty('links', expect.any(Array))
  expect(body).toHaveProperty('reviews', expect.any(Array))
})
