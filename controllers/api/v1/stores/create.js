const createStoreService = require('../../../../services/stores/create')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const store = await createStoreService(req.ctx)

  next({
    success: true,
    message: 'Store created successfully',
    data: { store },
  })
})
