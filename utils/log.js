const logError = (...error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR:', ...error)
  }
}

const logInfo = (...info) => {
  if (process.env.NODE_ENV === 'development') {
    console.info('INFO:', ...info)
  }
}

module.exports = {
  logError,
  logInfo,
}
