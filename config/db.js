const mongoose = require('mongoose')
const { logError, logInfo } = require('../utils/log')

mongoose.set('debug', ['staging', 'development'].includes(process.env.NODE_ENV))

mongoose.connection.on('connected', () => {
  logInfo('MongoDB connected')
})

mongoose.connection.on('open', () => {
  logInfo('MongoDB connection open')
})

mongoose.connection.on('disconnected', () => {
  logInfo('MongoDB disconnected')
})

mongoose.connection.on('reconnected', () => {
  logInfo('MongoDB reconnected')
})

mongoose.connection.on('disconnecting', () => {
  logInfo('MongoDB disconnecting')
})

mongoose.connection.on('close', () => {
  logInfo('MongoDB closed')
})

mongoose.connection.on('error', (err) => {
  logError(`MongoDB connection error: ${err}`)
  process.exit(1)
})

module.exports = {
  mongooseConnection: () => mongoose.connect(process.env.MONGODB_URI),
}
