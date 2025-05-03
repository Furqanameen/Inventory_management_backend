const Joi = require('joi')
const Store = require('../../models/store')
const Location = require('../../models/location')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin'])

  const { _id, name, locationId } = ctx.request.data

  const schema = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    name: Joi.string().optional(),
    locationId: Joi.string().hex().length(24).optional(),
  })

  const { error } = await joiValidate(schema, {
    _id,
    name,
    locationId,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }
  let location = undefined

  if (locationId !== undefined) {
    location = await Location.findOne({
      _id: locationId,
    }).exec()

    if (!location) {
      throw new CustomError('Location not found')
    }
  }

  let store = await Store.findOne({
    _id,
  })
    .populate({
      path: 'location',
      select: Location.publicFields(),
    })
    .exec()

  if (!store) {
    throw new CustomError('Store not found')
  }

  if (name !== undefined) {
    if (await Store.exists({ name, _id: { $ne: store._id } })) {
      throw new CustomError('Store already exists with this name')
    }

    store.name = name
    store.displayName = `${name} - ${store.location?.name ? store.location?.name : ''}`
  }

  if (locationId !== undefined) {
    if (
      await Store.exists({
        ...(name !== undefined ? { name } : { name: store.name }),
        location: location._id,
        _id: { $ne: store._id },
      })
    ) {
      throw new CustomError(
        'Store already exists with this name in this location'
      )
    }

    store.displayName = `${store.name} - ${location.name}`
    store.location = location._id
  }

  await store.save()

  return await Store.findById(store._id)
    .populate({
      path: 'location',
      select: Location.publicFields(),
    })
    .select(Store.publicFields())
    .exec()
}
