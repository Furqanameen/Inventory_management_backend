const Joi = require('joi')
const Location = require('../../models/location')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin'])

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

  const location = await Location.findOne({
    _id,
  }).exec()

  if (!location) {
    throw new CustomError('Location not found')
  }

  await location.softDelete()
  return location.publicObject()
}
