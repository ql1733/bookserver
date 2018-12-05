const mongoose = require('mongoose')
const Schema = mongoose.Schema

let CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: 'string', required: true },
    postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true }
}, {
    timestamps: true
})
CommentSchema.index({ PostId: 1, _id: -1 })
let Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment