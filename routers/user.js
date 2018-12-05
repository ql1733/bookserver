const express = require('express')
const router = express.Router()
const user = require('../controller/user.js')

router.post('/createUser', user.create)
router.post('/login', user.login)
router.post('/signOut', user.loginOut)
router.post('/upload', user.upload)

module.exports = router