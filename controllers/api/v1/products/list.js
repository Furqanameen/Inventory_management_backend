const listProductService = require('../../../../services/products/list')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const products = await listProductService(req.ctx)

  next({
    success: true,
    message: 'Products fetched successfully',
    data: { products },
  })
})
