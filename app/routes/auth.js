const checkAuth = require('../middleware/auth')
const express = require('express')
const router = express.Router()

const {loginYtCtrl, loginCbYt, getProfile} = require('../controlles/auth')

//TODO: Login !
// router.post('/login', loginCtrl)
//
// //TODO: Registrar un usuario
// router.post('/register', registerCtrl)

//TODO: Init Login Youtube
router.get('/login-youtube', loginYtCtrl)

//TODO: Init Login Youtube
router.get('/callback/youtube', loginCbYt)

//TODO: Init Login Youtube
router.get('/me', checkAuth, getProfile)

module.exports = router
