const listStoreService = require('../../../../services/stores/list')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const stores = await listStoreService(req.ctx)

  next({
    success: true,
    message: 'Stores fetched successfully',
    data: { stores },
  })
})
