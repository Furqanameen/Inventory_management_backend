const destroyProductService = require('../../../../services/products/destroy')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  await destroyProductService(req.ctx)

  next({
    success: true,
    message: 'Product deleted successfully',
  })
})
