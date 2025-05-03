const updateProfileService = require('../../../../services/profiles/update')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const profile = await updateProfileService(req.ctx)

  next({
    success: true,
    message: 'Profile updated successfully',
    data: { profile },
  })
})
