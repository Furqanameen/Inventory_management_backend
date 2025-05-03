const mongoose = require('mongoose')

const softDeletePlugin = (schema) => {
  schema.add({
    deleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null, index: true },
    deletedByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    deletedByProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      default: null,
      index: true,
    },
  })

  schema.methods.softDelete = async function (deletedByUser, deletedByProfile) {
    this.deleted = true
    this.deletedAt = new Date()
    this.deletedByUser = deletedByUser || null
    this.deletedByProfile = deletedByProfile || null
    return await this.save()
  }

  schema.methods.restore = async function () {
    this.deleted = false
    this.deletedAt = null
    this.deletedByUser = null
    this.deletedByProfile = null
    return await this.save()
  }

  schema.methods.isDeleted = function () {
    return this.deleted
  }
}

module.exports = { softDeletePlugin }
