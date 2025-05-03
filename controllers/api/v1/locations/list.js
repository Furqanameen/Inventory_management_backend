const listLocationService = require('../../../../services/locations/list')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const locations = await listLocationService(req.ctx)

  next({
    success: true,
    message: 'Location fetched successfully',
    data: { locations },
  })
})
