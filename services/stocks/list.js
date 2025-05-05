const Product = require('../../models/product')
const Stock = require('../../models/stockmovement')
const { pagyParams, pagyRes } = require('../../utils/pagination')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin', 'admin'], true)

  const { data } = ctx.request

  const {
    page,
    perPage,
    sortBy = 'createdAt',
    order = -1,
  } = pagyParams(data.page, data.perPage, data.sortBy, data.order)

  const { id } = data

  const filter = {
    store: ctx.auth.profile.store._id,
  }

  if (!id) {
    throw new CustomError('Product ID is required', 400)
  }

  if (id) {
    const product = await Product.findById(id)
    if (!product) {
      throw new CustomError('Product not found', 404)
    }
    filter.product = product._id
  }

  const productPromise = Stock.find(filter)
    .select(Stock.publicFields())
    .sort({ [sortBy]: order })
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec()

  const countPromise = Stock.countDocuments(filter).exec()
  const [products, count] = await Promise.all([productPromise, countPromise])

  return pagyRes(products, count, page, perPage)
}
