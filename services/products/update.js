const Joi = require('joi')
const Store = require('../../models/store')
const Product = require('../../models/product')
const { CustomError } = require('../../utils/error')
const { joiValidate, joiError } = require('../../utils/joi')
const { checkPermissions } = require('../../utils/auth')

module.exports = async (ctx) => {
  await checkPermissions(ctx, ['superadmin', 'admin'], true)

  const { _id, name, sku, barcode, purchasePrice, salePrice } = ctx.request.data

  const schema = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    name: Joi.string().optional(),
    sku: Joi.string().optional(),
    barcode: Joi.string().optional(),
    purchasePrice: Joi.number().positive().optional(),
    salePrice: Joi.number().positive().optional(),
  })

  const { error } = await joiValidate(schema, {
    _id,
    name,
    sku,
    barcode,
    purchasePrice,
    salePrice,
  })

  if (error) {
    throw new CustomError(joiError(error))
  }

  const product = await Product.findOne({
    _id,
    store: ctx.auth.profile.store._id,
  }).exec()

  if (!product) {
    throw new CustomError('Product not found')
  }

  if (name !== undefined) {
    if (
      await Product.exists({
        name,
        store: ctx.auth.profile.store._id,
        _id: { $ne: _id },
      })
    ) {
      throw new CustomError('Product with this name already exists')
    }

    product.name = name
  }
  if (sku !== undefined) {
    if (
      await Product.exists({
        sku,
        store: ctx.auth.profile.store._id,
        _id: { $ne: _id },
      })
    ) {
      throw new CustomError('Product with this SKU already exists')
    }

    product.sku = sku
  }
  if (barcode !== undefined) {
    if (
      await Product.exists({
        barcode,
        store: ctx.auth.profile.store._id,
        _id: { $ne: _id },
      })
    ) {
      throw new CustomError('Product with this barcode already exists')
    }

    product.barcode = barcode
  }
  if (purchasePrice !== undefined) {
    product.purchasePrice = purchasePrice
  }
  if (salePrice !== undefined) {
    product.salePrice = salePrice
  }

  await product.save()

  return await Product.findById(product._id)
    .populate({
      path: 'store',
      select: Store.publicFields(),
    })
    .select(Product.publicFields())
    .exec()
}
