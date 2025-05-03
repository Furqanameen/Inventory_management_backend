const destroyLocationService = require('../../../../services/locations/destroy')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  await destroyLocationService(req.ctx)

  next({
    success: true,
    message: 'Location deleted successfully',
  })
})
