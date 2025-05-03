const destroyProfileService = require('../../../../services/profiles/destroy')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  await destroyProfileService(req.ctx)

  next({
    success: true,
    message: 'Profile deleted successfully',
  })
})
