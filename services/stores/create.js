const Joi = require('joi')
const Store = require('../../models/store')
const Location = require('../../models/location')
const attachSUProfilesService = require('../users/attachsuprofiles')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin'])

  const { name, locationId } = ctx.request.data

  const schema = Joi.object({
    name: Joi.string().required(),
    locationId: Joi.string().hex().length(24).required(),
  })

  const { error } = await joiValidate(schema, {
    name,
    locationId,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  let location = await Location.findOne({
    _id: locationId,
  }).exec()

  if (!location) {
    throw new CustomError('Location not found')
  }

  let store = await Store.findOne({
    name,
    locationId,
  }).exec()

  if (store) {
    throw new CustomError(
      'Store already exists with this name in this location'
    )
  }

  store = new Store()
  store.name = name
  store.displayName = `${name} - ${location.name}`
  store.location = location._id

  await store.save()
  await attachSUProfilesService()

  return await Store.findById(store._id)
    .populate({
      path: 'location',
      select: Location.publicFields(),
    })
    .select(Store.publicFields())
    .exec()
}
