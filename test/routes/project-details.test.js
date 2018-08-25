const request = require('supertest')

const app = require('../create-test-app')

test('It should return the details about `Redux` project', async () => {
  const response = await request(app)
    .get('/projects/reduxjs/redux')
    .expect('Content-Type', /json/)
    .expect(200)
  const { body } = response
  const { name, github, npm, bundle, packageSize } = body
  expect(name).toBe('Redux')
  expect(github.full_name).toBe('reduxjs/redux')
  expect(npm.name).toBe('redux')
  expect(body).toHaveProperty('daily-trends', expect.any(Array))
  checkGitHub(github)
  checkNpm(npm)
  checkBundle(bundle)
  checkPackageSize(packageSize)
})

function checkGitHub(github) {
  expect(github).toHaveProperty('branch', expect.any(String))
  expect(github).toHaveProperty('description', expect.any(String))
  expect(github).toHaveProperty('stargazers_count', expect.any(Number))
  expect(github).toHaveProperty('owner_id', expect.any(Number))
  expect(github).toHaveProperty('commit_count', expect.any(Number))
  expect(github).toHaveProperty('contributor_count', expect.any(Number))
  expect(github).toHaveProperty('pushed_at', expect.toBeDate())
  expect(github.stargazers_count).toBeGreaterThan(10000)
}

function checkNpm(npm) {
  expect(npm).toHaveProperty('name', expect.any(String))
  expect(npm).toHaveProperty('dependencies', expect.any(Array))
  expect(npm).toHaveProperty('version', expect.any(String))
}

function checkPackageSize(packageSize) {
  expect(packageSize).toHaveProperty('version', expect.any(String))
  expect(packageSize).toHaveProperty('installSize', expect.any(Number))
  expect(packageSize).toHaveProperty('publishSize', expect.any(Number))
  expect(packageSize.installSize).toBeGreaterThan(10 * 1048)
}

function checkBundle(bundle) {
  expect(bundle).toHaveProperty('version', expect.any(String))
  expect(bundle).toHaveProperty('size', expect.any(Number))
  expect(bundle).toHaveProperty('gzip', expect.any(Number))
  expect(bundle.size).toBeGreaterThan(1048)
}
