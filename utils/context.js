const { logInfo } = require('./log')
const { mergeObjects } = require('./helpers')
const { tryLoginByToken } = require('./auth')

const attachRequestContext = async (req) => {
  const token = req.headers.authorization?.split(' ')?.pop() || null
  const profileHeader = req.headers.profile

  const ctx = {
    auth: {
      authenticated: false,
      profile: null,
      user: null,
      ...(await tryLoginByToken(token, profileHeader)),
    },
    request: {
      data: mergeObjects(
        req.params || {},
        req.query || {},
        req.body || {},
        req.files || {}
      ),
    },
  }

  logInfo('request =>', JSON.stringify(ctx, null, 2))

  req.ctx = ctx

  return ctx
}

module.exports = {
  attachRequestContext,
}
