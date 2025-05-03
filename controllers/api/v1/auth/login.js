const loginService = require('../../../../services/auth/login')
const { aysncMiddleware } = require('../../../../middlewares/async')

module.exports = aysncMiddleware(async (req, res, next) => {
  const user = await loginService(req.ctx)

  next({ success: true, message: 'Login successfully', data: { user } })
})
