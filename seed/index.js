global.__basedir = __dirname
require('../utils/dotenv')
const mongoose = require('mongoose')
const { mongooseConnection } = require('../config/db')
const { logInfo } = require('../utils/log')
const { createAdmin } = require('./scripts/users')

;(async () => {
  mongooseConnection().then(async () => {
    const closeServer = async (message) => {
      await mongoose.connection.close()
      logInfo(message)
      process.exit(0)
    }

    process.on('SIGTERM', async () => {
      await closeServer('Server terminated')
    })

    process.on('SIGINT', async () => {
      await closeServer('Server interrupted')
    })

    await createAdmin()

    logInfo('Seed completed')
    process.exit(0)
  })
})()
