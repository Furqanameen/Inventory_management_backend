const mergeObjects = (...args) => {
  return args.reduce((acc, obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value !== null
      ) {
        acc[key] =
          acc[key] && typeof acc[key] === 'object' && !Array.isArray(acc[key])
            ? mergeObjects(acc[key], value)
            : { ...value }
      } else {
        acc[key] = value
      }
    })
    return acc
  }, {})
}

module.exports = {
  mergeObjects,
}
