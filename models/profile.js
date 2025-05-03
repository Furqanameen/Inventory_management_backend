const mongoose = require('mongoose')
const { softDeletePlugin } = require('./plugins/softdelete')
const { jwtPlugin } = require('./plugins/jwt')
const { publicFieldsPlugin } = require('./plugins/serializer')

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['superadmin', 'admin', 'staff'],
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

profileSchema.plugin(jwtPlugin)
profileSchema.plugin(softDeletePlugin)
profileSchema.plugin(publicFieldsPlugin, [
  'name',
  'email',
  'role',
  'user',
  'store',
])

profileSchema.index({ user: 1, store: 1 }, { unique: true })

const Profile = mongoose.model('Profile', profileSchema)

module.exports = Profile
