const mongoose = require('mongoose')
const Schema = mongoose.Schema

let PostSchema = new Schema({
    author: { type:  Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: 'string', required: true },
    content: { type: 'string', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    pv: { type: 'number', default: 0 }
}, {
    timestamps: true
})
PostSchema.index({ author: 1, _id: -1 })
let Post = mongoose.model('Post', PostSchema)
module.exports = Post