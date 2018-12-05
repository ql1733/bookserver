const express = require('express')
const router = express.Router()
const book = require('../controller/book')
router.post('/input', book.input)
router.post('/upload', book.upload)
router.post('/list', book.list)
router.post('/detail', book.getDetail)
router.post('/edit', book.edit)
module.exports = router