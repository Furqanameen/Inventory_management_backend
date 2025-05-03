const Location = require('../../models/location')
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

  const { name, deleted } = data

  const filter = {}

  if (name) {
    filter.name = { $regex: name, $options: 'i' }
  }

  if (deleted) {
    filter.deleted = deleted
  }

  const locationPromise = Location.find(filter)
    .select(Location.publicFields())
    .sort({ [sortBy]: order })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec()

  const countPromise = Location.countDocuments(filter).exec()
  const [locations, count] = await Promise.all([locationPromise, countPromise])

  return pagyRes(locations, count, page, perPage)
}
