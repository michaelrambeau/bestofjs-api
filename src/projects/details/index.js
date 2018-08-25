const flow = require('lodash.flow')
const prettyBytes = require('pretty-bytes')
const debug = require('debug')('api')

const Model = require('../../models/Project')

const convertTag = tag => tag.code

async function findProject({ route }) {
  const { owner, repo } = route
  const full_name = `${owner}/${repo}`
  const query = { 'github.full_name': full_name }
  const fields = [
    'name',
    'icon.url',
    'github',
    'tags',
    'npm',
    'trends',
    'bundle',
    'packageSize'
  ]
  debug('Search for', query)
  const project = await Model.findOne(query, fields)
  if (!project) throw new Error(`Project not found '${full_name}'`)
  return convertProject(project)
}

const addTags = input => output => {
  const { tags } = input
  return tags
    ? Object.assign({}, output, { tags: tags.map(convertTag) })
    : output
}

const addTrends = input => output => {
  const { trends } = input
  return trends
    ? Object.assign({}, output, { 'daily-trends': trends.daily })
    : output
}

function convertProject(project) {
  const { github, npm, bundle, packageSize, name, icon } = project
  const output = {
    name,
    github,
    npm,
    icon: icon ? icon.url : null,
    bundle,
    packageSize
  }
  const response = flow([addTags(project), addTrends(project)])(output)
  debug('Sending', name, prettyBytes(JSON.stringify(response).length))
  return response
}

class ProjectDetails {
  find(params) {
    return findProject(params)
  }
}

module.exports = new ProjectDetails()
