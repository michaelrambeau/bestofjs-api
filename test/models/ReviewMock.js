const noop = _ => _

const LinkMock = {
  find() {
    return Promise.resolve([{}])
  },
  populate: noop
}

module.exports = LinkMock
