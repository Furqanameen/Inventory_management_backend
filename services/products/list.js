const Product = require('../../models/product')
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
