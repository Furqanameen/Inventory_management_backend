const express = require('express')
const { login, info } = require('../../../controllers/api/v1/auth')

const app = express.Router()

app.post('/login', login)
app.post('/info', info)

module.exports = app
