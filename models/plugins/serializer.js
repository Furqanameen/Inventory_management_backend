function publicFieldsPlugin(schema, fields) {
  if (!fields) {
    throw new Error('fields is required')
  }

  if (!Array.isArray(fields)) {
    throw new Error('fields must be an array')
  }

  const defaultFields = [
    'deleted',
    'deletedAt',
    'deletedByUser',
    'deletedByProfile',
    'createdAt',
    'updatedAt',
  ]

  schema.methods.publicFields = function (objectFormat = false) {
    const allfields = ['_id', ...fields, ...defaultFields]

    if (objectFormat) {
      return allfields.reduce((acc, field) => {
        acc[field] = 1
        return acc
      }, {})
    }
    return allfields
  }

  schema.statics.publicFields = function (objectFormat = false) {
    const allfields = ['_id', ...fields, ...defaultFields]

    if (objectFormat) {
      return allfields.reduce((acc, field) => {
        acc[field] = 1
        return acc
      }, {})
    }
    return allfields
  }

  schema.methods.publicObject = function () {
    const obj = this.toObject()
    const result = {}
    this.publicFields().forEach((field) => {
      result[field] = obj[field]
    })
    return result
  }
}

module.exports = { publicFieldsPlugin }
