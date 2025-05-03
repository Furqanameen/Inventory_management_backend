const Joi = require('joi')
const Profile = require('../../models/profile')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin', 'admin'], true)
  const { _id } = ctx.request.data

  const schema = Joi.object({
    _id: Joi.string().hex().length(24).required(),
  })

  const { error } = await joiValidate(schema, {
    _id,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  const profile = await Profile.findOne({
    _id,
    store: ctx.auth.profile.store._id,
  }).exec()

  if (!profile) {
    throw new CustomError('Profile not found')
  }

  return profile.publicObject()
}
