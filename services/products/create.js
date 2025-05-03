const Joi = require('joi')
const Store = require('../../models/store')
const Product = require('../../models/product')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin', 'admin'], true)

  const { name, sku, barcode, purchasePrice, salePrice } = ctx.request.data

  const schema = Joi.object({
    name: Joi.string().required(),
    sku: Joi.string().required(),
    barcode: Joi.string().required(),
    purchasePrice: Joi.number().positive().required(),
    salePrice: Joi.number().positive().required(),
  })

  const { error } = await joiValidate(schema, {
    name,
    sku,
    barcode,
    purchasePrice,
    salePrice,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  if (await Product.exists({ name, store: ctx.auth.profile.store._id })) {
    throw new CustomError('Product with this name already exists')
  }

  if (await Product.exists({ sku, store: ctx.auth.profile.store._id })) {
    throw new CustomError('Product with this SKU already exists')
  }

  if (await Product.exists({ barcode, store: ctx.auth.profile.store._id })) {
    throw new CustomError('Product with this barcode already exists')
  }

  const product = new Product()
  product.name = name
  product.sku = sku
  product.barcode = barcode
  product.purchasePrice = purchasePrice
  product.salePrice = salePrice
  product.store = ctx.auth.profile.store._id

  await product.save()

  return await Product.findById(product._id)
    .populate({
      path: 'store',
      select: Store.publicFields(),
    })
    .select(Product.publicFields())
    .exec()
}
