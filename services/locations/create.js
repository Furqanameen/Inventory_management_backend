const Joi = require('joi')
const Location = require('../../models/location')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin'])

  const { name } = ctx.request.data

  const schema = Joi.object({
    name: Joi.string().required(),
  })

  const { error } = await joiValidate(schema, {
    name,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  let location = await Location.findOne({
    name,
  }).exec()

  if (location) {
    throw new CustomError('Location already exists with this name')
  } else {
    location = new Location()
  }

  location.name = name

  await location.save()
  return location.publicObject()
}
