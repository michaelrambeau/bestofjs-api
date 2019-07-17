const prettyBytes = require('pretty-bytes')
const debug = require('debug')('api')

const { fetchIfNeeded } = require('../../helpers/next-update')
const { createStarStorage } = require('./star-storage')

async function findProject({ Project, Snapshot, full_name }) {
  const query = { 'github.full_name': full_name }
  const project = await Project.findOne(query).populate('tags')
  if (!project) throw new Error(`Project not found '${full_name}'`)

  const starCollection = Snapshot.collection
  const storage = createStarStorage(starCollection)

  const dailyTrends = await storage.getDailyTrends(project._id)
  debug(
    `${dailyTrends.length} daily trends found`,
    dailyTrends.slice(dailyTrends.length - 7)
  )
  project.dailyTrends = dailyTrends

  return convertProject(project)
}

function convertProject(project) {
  const description = project.getDescription()
  const {
    github,
    npm,
    bundle,
    packageSize,
    name,
    icon,
    tags,
    dailyTrends
  } = project

  const result = {
    name,
    description,
    github,
    npm,
    icon: icon ? icon.url : null,
    bundle,
    packageSize,
    tags: tags.map(tag => tag.code),
    dailyTrends
  }
  return result
}

const createService = ({ Project, Snapshot, cache, dailyUpdateUTCHour }) => {
  class ProjectDetails {
    async find({ route /*, params */ }) {
      const { owner, repo } = route
      const full_name = `${owner}/${repo}`
      const { data, meta } = await fetchIfNeeded({
        fetchFn: () => findProject({ full_name, Project, Snapshot }),
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
