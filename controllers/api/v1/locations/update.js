const updateLocationService = require('../../../../services/locations/update')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const location = await updateLocationService(req.ctx)

  next({
    success: true,
    message: 'Location updated successfully',
    data: { location },
  })
})
