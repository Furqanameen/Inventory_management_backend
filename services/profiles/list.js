const Profile = require('../../models/profile')
const { pagyParams, pagyRes } = require('../../utils/pagination')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin', 'admin'], true)

  const { data } = ctx.request

  const {
    page,
    perPage,
    sortBy = 'name',
    order = 1,
  } = pagyParams(data.page, data.perPage, data.sortBy, data.order)

  const { name, email, deleted } = data

  const filter = {
    store: ctx.auth.profile.store._id,
  }

  if (name) {
    filter.name = { $regex: name, $options: 'i' }
  }

  if (email) {
    filter.email = { $regex: email, $options: 'i' }
  }

  if (deleted) {
    filter.deleted = deleted
  }

  if (data.search) {
    const searchRegex = new RegExp(data.search, 'i') // case-insensitive regex
    const searchLower = data.search.toLowerCase()

    const orConditions = [
      { name: searchRegex },
      { email: searchRegex },
      { role: searchRegex },
    ]

    if (searchLower === 'active') {
      orConditions.push({ deleted: false })
    }
    if (searchLower === 'inactive') {
      orConditions.push({ deleted: true })
    }

    filter.$or = orConditions
  }

  const profilePromise = Profile.find(filter)
    .select(Profile.publicFields())
    .sort({ [sortBy]: order })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec()

  const countPromise = Profile.countDocuments(filter).exec()
  const [profiles, count] = await Promise.all([profilePromise, countPromise])

  return pagyRes(profiles, count, page, perPage)
}
