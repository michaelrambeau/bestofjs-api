const createUserContentService = ({ LinksService, ReviewsService }) => {
  return {
    async find(params) {
      // don't make the request in parallel to take advantage of the cache provided by the lookup service
      const links = await LinksService.find(params)
      const reviews = await ReviewsService.find(params)
      return {
        links,
        reviews
      }
    }
  }
}

module.exports = createUserContentService
