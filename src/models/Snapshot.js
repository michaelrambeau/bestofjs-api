const mongoose = require('mongoose')

const fields = {
  stars: Number,
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project'
  },
  createdAt: {
    type: Date
  }
}

const schema = new mongoose.Schema(fields, {
  collection: 'snapshot'
})

const model = mongoose.model('Snapshot', schema)

module.exports = model
