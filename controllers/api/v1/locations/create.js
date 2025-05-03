const createLocationService = require('../../../../services/locations/create')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const location = await createLocationService(req.ctx)

  next({
    success: true,
    message: 'Location created successfully',
    data: { location },
  })
})
