const mongoose = require('mongoose')
const { get } = require('lodash')
// const getErrorMessage = require('../helpers/getErrorMessage')
// const constants = require('./constants')

const constants = {
  COMMENT_MAX_LENGTH: 500,
  URL_MAX_LENGTH: 150,
  TITLE_MAX_LENGTH: 150
}

const fields = {
  projects: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Project',
      required: true
    }
  ],
  title: {
    type: String,
    maxlength: constants.TITLE_MAX_LENGTH,
    required: true
  },
  url: {
    type: String,
    maxlength: constants.URL_MAX_LENGTH,
    required: true,
    unique: true
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
    required: true
  },
  updatedAt: { type: Date },
  sample: Boolean
}

const schema = new mongoose.Schema(fields, {
  collection: 'links'
})

schema.methods.toJSON = function() {
  const item = this.toObject()
  return Object.assign({}, item, {
    projects: item.projects.map(
      project => get(project, 'github.full_name') || ''
    ),
    comment: get(item, 'comment.md') || ''
  })
}

// schema.statics.canCreate = function (data) {
//   return this.find({ url: data.url })
//     .then(results => {
//       console.log('Checking existing reviews', results)
//       if (results.length > 0) {
//         throw new Error(getErrorMessage('DUPLICATE_LINK'))
//       }
//       return true
//     })
// }

const model = mongoose.model('Link', schema)
module.exports = model
