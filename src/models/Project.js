const mongoose = require('mongoose')

const fields = {
  name: String,
  url: String,
  description: String,
  repository: String,
  tags: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tag'
    }
  ],
  snapshots: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Snapshot'
    }
  ],
  icon: {
    url: String
  },
  createdAt: {
    type: Date
  },
  disabled: {
    type: Boolean
  },
  deprecated: {
    type: Boolean
  },
  github: {
    name: String,
    full_name: String,
    description: String,
    homepage: String,
    stargazers_count: Number,
    pushed_at: Date
  },
  npm: {
    name: String,
    version: String,
    dependencies: Array
  },
  trends: {
    daily: Array
  },
  bundle: {
    name: String,
    dependencyCount: Number,
    gzip: Number,
    size: Number,
    version: String
  },
  packageSize: {
    publishSize: Number,
    installSize: Number,
    version: String
  }
}

const schema = new mongoose.Schema(fields, {
  collection: 'project'
})

schema.methods.toString = function() {
  return 'Project ' + this.name + ' ' + this._id
}

// schema.virtual('key').get(function () {
//   return this.name.toLowerCase().replace(/[^a-z._\-0-9]+/g, '-')
// })

// schema.index({ 'github.full_name': 1, type: -1 }); // schema level

const model = mongoose.model('Project', schema)
module.exports = model
