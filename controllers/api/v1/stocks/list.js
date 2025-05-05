const listStockService = require('../../../../services/stocks/list')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const stocks = await listStockService(req.ctx)

  next({
    success: true,
    message: 'Stocks fetched successfully',
    data: { stocks },
  })
})
