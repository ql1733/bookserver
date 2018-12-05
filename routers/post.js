const express = require('express')
const router = express.Router()
const post = require('../controller/post.js')
const check = require('../middel/check.js')

router.post('/create', check.checkLogin, post.create) //创建一条
router.post('/list', check.checkLogin, post.getList) //获取列表
router.post('/delect', check.checkLogin, post.delectOnePost) //删除一条
router.post('/edit', check.checkLogin, post.editPost) //编辑一条
router.post('/allList', check.checkLogin, post.getAllList) //获取所有列表

module.exports = router