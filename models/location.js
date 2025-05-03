const mongoose = require('mongoose')
const { softDeletePlugin } = require('./plugins/softdelete')
const { jwtPlugin } = require('./plugins/jwt')
const { publicFieldsPlugin } = require('./plugins/serializer')

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
)

locationSchema.plugin(jwtPlugin)
locationSchema.plugin(softDeletePlugin)
locationSchema.plugin(publicFieldsPlugin, ['name'])

const Location = mongoose.model('Location', locationSchema)

module.exports = Location
