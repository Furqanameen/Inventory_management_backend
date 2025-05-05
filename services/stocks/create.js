const Joi = require('joi')
const Store = require('../../models/store')
const Product = require('../../models/product')
const Stock = require('../../models/stockmovement')
const Profile = require('../../models/profile')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin', 'admin'], true)

  const { productId, quantity, stockType, comment } = ctx.request.data

  const schema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().required(),
    stockType: Joi.string().valid('IN', 'OUT').required(),
    comment: Joi.string().allow(null, ''),
  })

  const { error } = await joiValidate(schema, {
    productId,
    quantity,
    stockType,
    comment,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  const product = await Product.findById(productId)

  if (!product) {
    throw new CustomError('Product not found', 404)
  }

  // if it’s an “OUT” movement, require enough qty
  if (stockType === 'OUT') {
    if (product.quantity < quantity) {
      throw new CustomError('Insufficient stock for this product')
    }
    product.quantity -= quantity

    // if it’s an “IN” movement, bump inventory up
  } else if (stockType === 'IN') {
    product.quantity += quantity
  }

  console.log('ctx.auth.profile', ctx.auth.profile)

  const stock = new Stock()
  stock.product = product._id
  stock.quantity = quantity
  stock.stockType = stockType
  stock.comment = comment
  stock.profile = ctx.auth.profile._id
  stock.user = ctx.auth.user._id
  stock.store = ctx.auth.profile.store._id

  await stock.save()

  await product.save()

  return await Stock.findById(stock._id)
    .populate({
      path: 'store',
      select: Store.publicFields(),
    })
    .populate({
      path: 'product',
      select: Product.publicFields(),
    })
    .populate({
      path: 'profile',
      select: Profile.publicFields(),
    })
    .select(Stock.publicFields())
    .exec()
}
