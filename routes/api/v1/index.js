const express = require('express')
const authRouter = require('./auth')
const locationsRouter = require('./locations')
const storesRouter = require('./stores')
const productsRouter = require('./products')
const profilesRouter = require('./profiles')
const stocksRouter = require('./stocks')
const responseHandler = require('../../../middlewares/response')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/stores', storesRouter)
router.use('/profiles', profilesRouter)
router.use('/products', productsRouter)
router.use('/locations', locationsRouter)
router.use('/stocks', stocksRouter)
router.use(responseHandler)

module.exports = router
