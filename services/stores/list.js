const Store = require('../../models/store')
const { pagyParams, pagyRes } = require('../../utils/pagination')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin'])

  const { data } = ctx.request

  const {
    page,
    perPage,
    sortBy = 'name',
    order = 1,
  } = pagyParams(data.page, data.perPage, data.sortBy, data.order)

  const { name, displayName, location, deleted } = data

  const filter = {}

  if (name) {
    filter.name = { $regex: name, $options: 'i' }
  }

  if (displayName) {
    filter.displayName = { $regex: displayName, $options: 'i' }
  }

  if (location) {
    filter.location = location
  }

  if (data.deleted) {
    filter.deleted = deleted
  }

  if (data.search) {
    const searchRegex = new RegExp(data.search, 'i') // case-insensitive regex
    const searchLower = data.search.toLowerCase()

    const orConditions = [{ name: searchRegex }, { displayName: searchRegex }]

    if (searchLower === 'active') {
      orConditions.push({ deleted: false })
    }
    if (searchLower === 'inactive') {
      orConditions.push({ deleted: true })
    }

    filter.$or = orConditions
  }

  const storePromise = Store.find(filter)
    .select(Store.publicFields())
    .sort({ [sortBy]: order })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec()

  const countPromise = Store.countDocuments(filter).exec()
  const [stores, count] = await Promise.all([storePromise, countPromise])

  return pagyRes(stores, count, page, perPage)
}
