const showStoreService = require('../../../../services/stores/show')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const store = await showStoreService(req.ctx)

  next({
    success: true,
    message: 'Store details',
    data: { store },
  })
})
