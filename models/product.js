const mongoose = require('mongoose')
const { softDeletePlugin } = require('./plugins/softdelete')
const { jwtPlugin } = require('./plugins/jwt')
const { publicFieldsPlugin } = require('./plugins/serializer')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    barcode: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    purchasePrice: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    salePrice: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

productSchema.plugin(jwtPlugin)
productSchema.plugin(softDeletePlugin)
productSchema.plugin(publicFieldsPlugin, [
  'name',
  'sku',
  'barcode',
  'purchasePrice',
  'salePrice',
  'quantity',
  'store',
])

const Product = mongoose.model('Product', productSchema)

module.exports = Product
