const express = require('express')
const router = express.Router()
const getHomeList = require('../controller/user')
router.post('/list', getHomeList)

module.exports = router