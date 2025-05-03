const mongoose = require('mongoose')
const { softDeletePlugin } = require('./plugins/softdelete')
const { jwtPlugin } = require('./plugins/jwt')
const { publicFieldsPlugin } = require('./plugins/serializer')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    encryptedPassword: {
      type: String,
      default: null,
    },
    admin: {
      type: Boolean,
      default: false,
    },
    profiles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        index: true,
      },
    ],
  },
  {
    timestamps: true,
  }
)

userSchema.plugin(jwtPlugin)
userSchema.plugin(softDeletePlugin)
userSchema.plugin(publicFieldsPlugin, ['name', 'email', 'admin', 'profiles'])

const User = mongoose.model('User', userSchema)

module.exports = User
