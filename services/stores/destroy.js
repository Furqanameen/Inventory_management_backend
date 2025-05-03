const Joi = require('joi')
const Store = require('../../models/store')
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

  const store = await Store.findOne({
    _id,
  }).exec()

  if (!store) {
    throw new CustomError('Store not found')
  }

  await store.softDelete()
  return store.publicObject()
}
