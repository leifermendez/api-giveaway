const express = require('express')
const router = express.Router()
const checkOrigin = require('../middleware/origin')
const checkAuth = require('../middleware/auth')
const checkAuthRole = require('../middleware/roleAuth')
const {cacheInit} = require('../middleware/cache')
const {getItems} = require('../controlles/raffle')

router.get(
    '/',
    checkAuth,
    // checkAuthRole(['admin']),
    getItems
)


module.exports = router
