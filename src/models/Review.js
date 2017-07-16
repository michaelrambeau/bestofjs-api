const mongoose = require('mongoose')
const get = require('lodash.get')
// const getErrorMessage = require('../helpers/getErrorMessage')
const constants = {
  COMMENT_MAX_LENGTH: 500,
  URL_MAX_LENGTH: 150,
  TITLE_MAX_LENGTH: 150
}

const fields = {
  project: {
    type: mongoose.Schema.ObjectId,
    ref: 'Project',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    html: String,
    md: {
      type: String,
      maxlength: constants.COMMENT_MAX_LENGTH
    }
  },
  createdAt: {
    type: Date,
    required: true
  },
  createdBy: {
    type: String,
    maxlength: 100,
    required: true
  },
  updatedAt: { type: Date },
  sample: Boolean
}

const schema = new mongoose.Schema(fields, {
  collection: 'reviews'
})

schema.methods.toJSON = function() {
  const item = this.toObject()
  return Object.assign({}, item, {
    project: get(item, 'project.github.full_name') || '',
    comment: get(item, 'comment.md') || ''
  })
}

// schema.statics.canCreate = function (data) {
//   return this.find({ project: data.project, createdBy: data.createdBy })
//     .then(results => {
//       console.log('Existing reviews by the same user', results)
//       if (results.length > 0) {
//         throw new Error(getErrorMessage('DUPLICATE_REVIEW'))
//       }
//       return true
//     })
// }

const model = mongoose.model('Review', schema)
module.exports = model
