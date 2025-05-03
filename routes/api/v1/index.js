const express = require('express')
const authRouter = require('./auth')
const locationsRouter = require('./locations')
const storesRouter = require('./stores')
const responseHandler = require('../../../middlewares/response')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/stores', storesRouter)
router.use('/locations', locationsRouter)
router.use(responseHandler)

module.exports = router
