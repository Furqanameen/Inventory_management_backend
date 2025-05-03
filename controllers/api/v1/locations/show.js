const showLocationService = require('../../../../services/locations/show')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const location = await showLocationService(req.ctx)

  next({
    success: true,
    message: 'Location details',
    data: { location },
  })
})
