const express = require('express')
const router = express.Router()
const comment = require('../controller/comment.js')
router.post('/create', comment.create) //创建一条
router.post('/getList', comment.getList) //获取列表
router.post('/delectMessage', comment.deleteOneMessage) //删除一条

module.exports = router