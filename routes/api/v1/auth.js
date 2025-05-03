const express = require('express')
const { login } = require('../../../controllers/api/v1/auth')

const app = express.Router()

app.post('/login', login)

module.exports = app
