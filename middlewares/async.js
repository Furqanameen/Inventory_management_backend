const { attachRequestContext } = require('../utils/context')

const aysncMiddleware = (handler) => {
  return async (req, res, next) => {
    try {
      await attachRequestContext(req)
      await handler(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = {
  aysncMiddleware,
}
