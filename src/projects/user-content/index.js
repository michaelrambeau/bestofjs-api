const LinksService = require('./links-service')
const ReviewsService = require('./reviews-service')

class UserContentService {
  find(params) {
    const requests = [LinksService.find(params), ReviewsService.find(params)]
    return Promise.all(requests).then(([links, reviews]) => ({
      links,
      reviews
    }))
  }
}

const service = new UserContentService()

module.exports = service
