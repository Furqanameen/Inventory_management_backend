global.__basedir = __dirname
require('./utils/dotenv')
const path = require('path')
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const fileUpload = require('express-fileupload')
const apiV1Routes = require('./routes/api/v1')
const { logInfo } = require('./utils/log')
const { mongooseConnection } = require('./config/db')
const app = express()

app.use(cors({ origin: '*' }))
app.use(helmet())
app.use(compression())
app.use(
  fileUpload({
    debug: process.env.NODE_ENV === 'development',
    parseNested: true,
    createParentPath: true,
    preserveExtension: true,
  })
)
app.use(express.json({ limit: '50mb' }))
app.use(morgan(':method :url :status :response-time ms'))
app.use('/api/v1', apiV1Routes)
app.use('/storage', express.static(path.join(__dirname, './storage')))

mongooseConnection().then(() => {
  const server = app.listen(process.env.APP_PORT, async () => {
    logInfo(
      `App listening on port ${process.env.APP_PORT} in ${process.env.NODE_ENV} environment`
    )
  })

  const closeServer = async (message) => {
    await mongoose.connection.close()
    await server.close()

    logInfo(message)
    process.exit(0)
  }

  process.on('SIGTERM', async () => {
    await closeServer('Server terminated')
  })

  process.on('SIGINT', async () => {
    await closeServer('Server interrupted')
  })
})
