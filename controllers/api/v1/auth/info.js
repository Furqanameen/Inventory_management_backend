const infoService = require('../../../../services/auth/info')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const user = await infoService(req.ctx)

  next({ success: true, message: 'Login info', data: { user } })
})
