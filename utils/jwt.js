const jwt = require('jsonwebtoken')

const signToken = async (payload = {}) => {
  if (!process.env.APP_PRIVATE_KEY) {
    throw new Error('APP_PRIVATE_KEY not set')
  }

  return jwt.sign(payload, process.env.APP_PRIVATE_KEY, {
    algorithm: 'RS256',
  })
}

const decodeToken = async (token, publicKey = undefined) => {
  if (!publicKey && !process.env.APP_PUBLIC_KEY) {
    throw new Error('APP_PUBLIC_KEY key not set')
  }

  if (!token) {
    return false
  }

  try {
    return await jwt.verify(token, publicKey || process.env.APP_PUBLIC_KEY, {
      algorithms: ['RS256'],
    })
  } catch (error) {
    return false
  }
}

module.exports = {
  signToken,
  decodeToken,
}
