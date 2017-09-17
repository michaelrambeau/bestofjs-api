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
  return Object.assign({}, convertProject(project), {
    'daily-trends': project.trends.daily
  })
}

function convertProject(project) {
  debug('Convert', project.name)
  const tags = project.tags.map(convertTag)
  const { github, npm } = project
  return {
    name: project.name,
    github,
    tags,
    npm,
    icon: project.icon ? project.icon.url : null
  }
}

const getProject = full_name => {
  const options = {
    query: {
      'github.full_name': full_name,
      $select: ['name', 'icon.url', 'github', 'tags', 'npm', 'trends'],
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
