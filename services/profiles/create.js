const Joi = require('joi')
const User = require('../../models/user')
const Profile = require('../../models/profile')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { checkPermissions } = require('../../utils/auth')
const { encryptPassword } = require('../../utils/password')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin', 'admin'], true)

  const { name, email, role, password } = ctx.request.data

  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'staff').required(),
    password: Joi.string().min(5).required(),
  })

  const { error } = await joiValidate(schema, {
    name,
    email,
    role,
    password,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  let user = await User.findOne({ email: email.toLowerCase() }).exec()

  if (user) {
    if (
      await Profile.exists({
        user: user._id,
        store: ctx.auth.profile.store._id,
      })
    ) {
      throw new CustomError('User already exists in this store')
    } else {
      user.name = name
      user.encryptPassword = await encryptPassword(password)
      await user.save()
    }
  } else {
    user = new User()
    user.name = name
    user.email = email.toLowerCase()
    user.encryptedPassword = await encryptPassword(password)
    await user.save()
  }

  const profile = new Profile()
  profile.name = name
  profile.email = email.toLowerCase()
  profile.role = role
  profile.user = user._id
  profile.store = ctx.auth.profile.store._id

  await profile.save()
  return profile.publicObject()
}
