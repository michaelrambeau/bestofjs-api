const mongoose = require('mongoose')

const fields = {
  name: String,
  url: String,
  override_url: Boolean,
  description: String,
  override_description: Boolean,
  repository: String,
  tags: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tag'
    }
  ],
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
    pushed_at: Date,
    branch: String,
    packageJson: Boolean,
    owner_id: Number,
    topics: Array,
    commit_count: Number,
    contributor_count: Number,
    created_at: Date,
    archived: Boolean,
    updatedAt: Date
  },
  npm: {
    name: String,
    version: String,
    dependencies: [String]
  },
  bundle: {
    name: String,
    dependencyCount: Number,
    gzip: Number,
    size: Number,
    version: String,
    errorMessage: String
  },
  packageSize: {
    name: String,
    installSize: Number,
    publishSize: Number,
    version: String,
    errorMessage: String
  },
  packagequality: {
    quality: Number
  },
  npms: {
    score: {
      detail: {
        maintenance: Number,
        popularity: Number,
        quality: Number
      },
      final: Number
    }
  },
  icon: {
    url: String
  },
  colors: {
    vibrant: String
  },
  trends: Object,
  twitter: String
}

const schema = new mongoose.Schema(fields, {
  collection: 'projects'
})

schema.methods.toString = function() {
  return 'Project ' + this.name + ' ' + this._id
}

// For some projects, don't use the GitHub description that is not really relevant
schema.methods.getDescription = function() {
  const { description: githubDescription } = this.github

  const overrideGithubDescription =
    this.override_description || !githubDescription
  return overrideGithubDescription ? this.description : githubDescription
}

// schema.virtual('key').get(function () {
//   return this.name.toLowerCase().replace(/[^a-z._\-0-9]+/g, '-')
// })

// schema.index({ 'github.full_name': 1, type: -1 }); // schema level

const model = mongoose.model('Project', schema)
module.exports = model
