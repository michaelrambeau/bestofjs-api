const noop = _ => _

const LinkMock = {
  find() {
    return [{}]
  },
  populate: noop
}

module.exports = LinkMock
