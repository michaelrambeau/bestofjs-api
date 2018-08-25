const debug = require('debug')('api')

const createLookupService = ({ Model, cache }) => {
  debug('Creating the lookup service')
  return {
    async getIdByFullname({ full_name }) {
      const cachedValue = cache.get(full_name)
      if (cachedValue) return cachedValue
      const dbValue = await fetchIdFromDB({ full_name, Model })
      cache.set(full_name, dbValue)
      return dbValue
    }
  }
}

const fetchIdFromDB = async ({ Model, full_name }) => {
  debug('[Not in cache] search for', full_name, Model.modelName)
  const query = {
    'github.full_name': full_name
  }
  const fields = { _id: 1, name: 1 }
  const project = await Model.findOne(query, fields)
  if (!project) throw new Error(`No project found ${full_name}`)
  const { _id } = project
  return _id
}

module.exports = createLookupService
