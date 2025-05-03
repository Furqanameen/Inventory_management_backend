const listProfileService = require('../../../../services/profiles/list')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const profiles = await listProfileService(req.ctx)

  next({
    success: true,
    message: 'Profile fetched successfully',
    data: { profiles },
  })
})
