const Joi = require('joi')
const User = require('../../models/user')
const Profile = require('../../models/profile')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { checkPermissions } = require('../../utils/auth')
const { encryptPassword } = require('../../utils/password')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin', 'admin'], true)

  const { _id, role, password, deleted } = ctx.request.data

  const schema = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    role: Joi.string().valid('admin', 'staff').optional(),
    password: Joi.string().min(5).optional(),
    deleted: Joi.boolean().optional(),
  })

  const { error } = await joiValidate(schema, {
    _id,
    role,
    password,
    deleted,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  const profile = await Profile.findOne({
    _id,
    store: ctx.auth.profile.store._id,
  }).exec()

  if (role !== undefined) {
    profile.role = role
  }

  if (password !== undefined) {
    await User.updateOne(
      { _id: profile.user },
      {
        encryptedPassword: await encryptPassword(password),
      }
    )
  }

  if (deleted === 'false') {
    await profile.restore()
  }

  if (deleted === 'true') {
    await profile.softDelete()
  }

  await profile.save()
  return profile.publicObject()
}
