const showProductService = require('../../../../services/products/show')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const product = await showProductService(req.ctx)

  next({
    success: true,
    message: 'Product details',
    data: { product },
  })
})
