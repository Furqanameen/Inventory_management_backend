const destroyStoreService = require('../../../../services/stores/destroy')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  await destroyStoreService(req.ctx)

  next({
    success: true,
    message: 'Store deleted successfully',
  })
})
