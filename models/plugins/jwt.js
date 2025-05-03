const { signToken } = require('../../utils/jwt')

const generateJwtToken = async (_id, otpVerified) => {
  return await signToken(
    {
      _id,
      otpVerified: otpVerified === true,
    },
    {
      expiresIn: '7d',
    }
  )
}

const jwtPlugin = (schema) => {
  schema.methods.generateJwtToken = async function (otpVerified = false) {
    return await generateJwtToken(this._id, otpVerified, otpVerified)
  }

  schema.statics.generateJwtToken = async function (_id, otpVerified = false) {
    return await generateJwtToken(_id, otpVerified)
  }
}

module.exports = { jwtPlugin }
