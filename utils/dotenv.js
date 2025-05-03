const { logError } = require('../utils/log')

if (!process.env.NODE_ENV) {
  logError('NODE_ENV is not defined')
  process.exit(1)
}

const validNodeEnvList = ['development', 'staging', 'production']

if (!validNodeEnvList.includes(process.env.NODE_ENV)) {
  logError(
    'NODE_ENV is invalid, must be one of: ' + validNodeEnvList.join(', ')
  )
  process.exit(1)
}

let nodeEnvFile = '.env.' + process.env.NODE_ENV

try {
  require('fs').accessSync(nodeEnvFile)
} catch (e) {
  logError(nodeEnvFile + ' file not found')
  process.exit(1)
}

require('dotenv').config({ path: nodeEnvFile })

process.env.APP_PORT = process.env.APP_PORT || 3000
