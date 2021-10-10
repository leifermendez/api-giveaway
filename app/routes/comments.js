const express = require('express')
const checkAuth = require('../middleware/auth')
const {cacheInit} = require('../middleware/cache')
const router = express.Router()
const {getItems} = require('../controlles/comments')

//TODO: Debido a que Youtube Limita las quoatas de llamado utilizaremos un cache de 1 hora!
router.get('/:user', checkAuth, cacheInit, getItems)

module.exports = router
