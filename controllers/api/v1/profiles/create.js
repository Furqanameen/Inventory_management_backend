const createProfileService = require('../../../../services/profiles/create')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const profile = await createProfileService(req.ctx)

  next({
    success: true,
    message: 'Profile created successfully',
    data: { profile },
  })
})
