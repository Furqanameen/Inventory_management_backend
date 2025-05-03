const showProfileService = require('../../../../services/profiles/show')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const profile = await showProfileService(req.ctx)

  next({
    success: true,
    message: 'Profile details',
    data: { profile },
  })
})
