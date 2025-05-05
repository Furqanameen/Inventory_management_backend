const bcrypt = require('bcrypt')
const Joi = require('joi')
const User = require('../../models/user')
const Store = require('../../models/store')
const Profile = require('../../models/profile')
const Location = require('../../models/location')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')

module.exports = async (ctx) => {
  const { email, password } = ctx.request.data

  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  })

  const { error } = await joiValidate(schema, {
    email,
    password,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  const user = await User.findOne({ email: email.toLowerCase() }).exec()

  if (!user) {
    throw new CustomError('Invalid emai or password')
  }

  const valid = await bcrypt.compare(password, user.encryptedPassword)
  if (!valid) {
    throw new CustomError('Invalid email or password')
  }

  return {
    ...(
      await User.findById(user._id)
        .populate({
          path: 'profiles',
          select: Profile.publicFields(),
          populate: [
            {
              path: 'store',
              select: Store.publicFields(),
              populate: [
                {
                  path: 'location',
                  select: Location.publicFields(),
                },
              ],
            },
          ],
        })
        .select(User.publicFields())
        .exec()
    ).toJSON(),
    token: await user.generateJwtToken(false),
  }
}
