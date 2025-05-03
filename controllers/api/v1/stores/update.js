const updateStoreService = require('../../../../services/stores/update')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const store = await updateStoreService(req.ctx)

  next({
    success: true,
    message: 'Store updated successfully',
    data: { store },
  })
})
