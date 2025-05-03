const updateProductService = require('../../../../services/products/update')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const product = await updateProductService(req.ctx)

  next({
    success: true,
    message: 'Product updated successfully',
    data: { product },
  })
})
