const flow = require('lodash.flow')
const prettyBytes = require('pretty-bytes')
const debug = require('debug')('api')

const { fetchIfNeeded } = require('../../helpers/next-update')

const convertTag = tag => tag.code

async function findProject({ Project, full_name }) {
  const query = { 'github.full_name': full_name }
  const fields = [
    'name',
    'icon.url',
    'github',
    // 'tags',
    'npm',
    'trends',
    'bundle',
    'packageSize'
  ]
  const project = await Project.findOne(query, fields)
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
  return response
}

const createService = ({ Project, cache, dailyUpdateUTCHour }) => {
  class ProjectDetails {
    async find({ route /*, params */ }) {
      const { owner, repo } = route
      const full_name = `${owner}/${repo}`
      const { data, meta } = await fetchIfNeeded({
        fetchFn: () => findProject({ full_name, Project }),
        key: full_name,
        cache,
        currentDate: new Date(),
        dailyUpdateUTCHour
      })
      const { fromCache } = meta
      debug(
        'Sending',
        full_name,
        prettyBytes(JSON.stringify(data).length),
        fromCache ? 'from the cache' : '[NOT IN CACHE]'
      )
      return data
    }
  }
  return new ProjectDetails({ Project })
}

module.exports = createService
