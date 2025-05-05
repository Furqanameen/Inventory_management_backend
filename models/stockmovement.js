const mongoose = require('mongoose')
const { softDeletePlugin } = require('./plugins/softdelete')
const { jwtPlugin } = require('./plugins/jwt')
const { publicFieldsPlugin } = require('./plugins/serializer')

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    stockType: {
      type: String,
      enum: ['IN', 'OUT'],
      required: true,
      index: true,
    },
    comment: {
      type: String,
      trim: true,
      default: null,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

stockMovementSchema.plugin(jwtPlugin)
stockMovementSchema.plugin(softDeletePlugin)
stockMovementSchema.plugin(publicFieldsPlugin, [
  'product',
  'store',
  'quantity',
  'stockType',
  'comment',
  'profile',
  'user',
])

const StockMovement = mongoose.model('StockMovement', stockMovementSchema)

module.exports = StockMovement
