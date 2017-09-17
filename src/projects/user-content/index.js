const LinksService = require('./links-service')
const ReviewsService = require('./reviews-service')

const userContentService = {
  find(params) {
    const requests = [LinksService.find(params), ReviewsService.find(params)]
    return Promise.all(requests).then(([links, reviews]) => ({
      links,
      reviews
    }))
  }
}

module.exports = userContentService
