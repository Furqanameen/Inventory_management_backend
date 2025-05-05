const createStockService = require('../../../../services/stocks/create')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const stock = await createStockService(req.ctx)

  next({
    success: true,
    message: 'Stock created successfully',
    data: { stock },
  })
})
