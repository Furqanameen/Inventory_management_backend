const Joi = require('joi')
const Store = require('../../models/store')
const Location = require('../../models/location')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin'])

  const { _id, name } = ctx.request.data

  const schema = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    name: Joi.string().optional(),
  })

  const { error } = await joiValidate(schema, {
    _id,
    name,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  const location = await Location.findOne({
    _id,
  })

  if (!location) {
    throw new CustomError('Location not found')
  }

  if (name !== undefined) {
    if (await Location.exists({ name, _id: { $ne: location._id } })) {
      throw new CustomError('Location already exists with this title')
    }

    location.name = name
  }

  await location.save()

  if (name !== undefined) {
    const stores = await Store.find({ location: location._id }).exec()

    for (const store of stores) {
      store.displayName = `${store.name} - ${location.name}`
      await store.save()
    }
  }

  return location.publicObject()
}
