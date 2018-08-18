const debug = require('debug')('api')
const ProjectsService = require('../projects-service')

const convertTag = tag => tag.code

async function findProject(params) {
  const { owner, repo } = params
  const full_name = `${owner}/${repo}`
  debug('Search for', full_name)
  const result = await getProject(full_name)
  const { data } = result
  const project = data[0]
  if (!project) throw new Error(`Project not found '${full_name}'`)
  return Object.assign({}, convertProject(project), {
    'daily-trends': project.trends.daily
  })
}

function convertProject(project) {
  debug('Convert', project)
  const tags = project.tags.map(convertTag)
  const { github, npm, bundle, packageSize } = project
  return {
    name: project.name,
    github,
    tags,
    npm,
    icon: project.icon ? project.icon.url : null,
    bundle,
    packageSize
  }
}

const getProject = full_name => {
  const options = {
    query: {
      'github.full_name': full_name,
      $select: [
        'name',
        'icon.url',
        'github',
        'tags',
        'npm',
        'trends',
        'bundle',
        'packageSize'
      ],
      $populate: ['tags']
    }
  }
  return ProjectsService.find(options)
}

class ProjectDetails {
  find(params) {
    return findProject(params)
  }
}

module.exports = new ProjectDetails()
