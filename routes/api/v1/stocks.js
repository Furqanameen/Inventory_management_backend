const express = require('express')
const { list, create } = require('../../../controllers/api/v1/stocks')

const app = express.Router()

app.get('/:id', list)
app.post('/', create)

module.exports = app
