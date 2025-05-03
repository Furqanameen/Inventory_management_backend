const mongoose = require('mongoose')
const { softDeletePlugin } = require('./plugins/softdelete')
const { jwtPlugin } = require('./plugins/jwt')
const { publicFieldsPlugin } = require('./plugins/serializer')

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

storeSchema.plugin(jwtPlugin)
storeSchema.plugin(softDeletePlugin)
storeSchema.plugin(publicFieldsPlugin, ['name', 'displayName', 'location'])

storeSchema.index({ location: 1, name: 1 }, { unique: true })

const Store = mongoose.model('Store', storeSchema)

module.exports = Store
