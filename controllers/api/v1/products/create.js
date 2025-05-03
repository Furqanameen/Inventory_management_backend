const createProductService = require('../../../../services/products/create')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const product = await createProductService(req.ctx)

  next({
    success: true,
    message: 'Product created successfully',
    data: { product },
  })
})
