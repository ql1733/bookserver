const mongoose = require('mongoose')
const Schema = mongoose.Schema
let bookSchema = new Schema({
    eBookName: { type: 'string' },
    cBookName: { type: 'string' },
    publishTime: { type: 'date' },
    author: { type: 'string' },
    press: { type: 'string' },
    buyTime: { type: 'date' },
    edition: { type: 'string' },
    isbn: { type: 'string' },
    img: { type: 'string' }
})
bookSchema.index({ author: 1, _id: -1 })
let Book = mongoose.model('book', bookSchema)
module.exports = Book