const Product = require('../../models/product')
const { pagyParams, pagyRes } = require('../../utils/pagination')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin', 'admin', 'staff'], true)

  const { data } = ctx.request

  const {
    page,
    perPage,
    sortBy = 'name',
    order = 1,
  } = pagyParams(data.page, data.perPage, data.sortBy, data.order)

  const { name, sku, barcode, deleted } = data

  const filter = {
    store: ctx.auth.profile.store._id,
  }

  if (name) {
    filter.name = { $regex: name, $options: 'i' }
  }

  if (sku) {
    filter.sku = { $regex: sku, $options: 'i' }
  }

  if (barcode) {
    filter.barcode = { $regex: barcode, $options: 'i' }
  }

  if (deleted) {
    filter.deleted = deleted
  }

  if (data.search) {
    const searchRegex = new RegExp(data.search, 'i') // case-insensitive regex
    const searchNumber = parseFloat(data.search)
    const searchLower = data.search.toLowerCase()

    const orConditions = [
      { name: searchRegex },
      { sku: searchRegex },
      { barcode: searchRegex },
    ]

    // Only add numeric search conditions if search is a valid number
    if (!isNaN(searchNumber)) {
      orConditions.push(
        { purchasePrice: searchNumber },
        { salePrice: searchNumber },
        { quantity: searchNumber }
      )
    }

    if (searchLower === 'active') {
      orConditions.push({ deleted: false })
    }
    if (searchLower === 'inactive') {
      orConditions.push({ deleted: true })
    }

    filter.$or = orConditions
  }

  const productPromise = Product.find(filter)
    .select(Product.publicFields())
    .sort({ [sortBy]: order })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec()

  const countPromise = Product.countDocuments(filter).exec()
  const [products, count] = await Promise.all([productPromise, countPromise])

  return pagyRes(products, count, page, perPage)
}
