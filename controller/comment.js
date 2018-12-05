const Comment = require('../models/comment.js')
const mongoose = require('mongoose')
module.exports = {
    create: function(req, res, next) {
        let comment = {
            author: req.session.user._id,
            content: req.body.content,
            postId: req.body._id
        }
        Comment.create(comment, (err, result) => {
            if (err) {
                res.json({
                    status: 0,
                    message: "评论失败"
                })
            } else {
                res.json({
                    status: 1,
                    message: "评论成功",
                    data: result
                })
            }
        })
    },
    getList: function(req, res, next) {
        let postId = req.body.postId
        Comment.find({ postId: postId }, null, { limit: 5, sort: { 'createdAt': -1 } }).populate({ path: 'author', select: 'name' }).exec(function(err, result) {

            if (err) {
                res.json({
                    status: 0,
                    message: err
                })
            } else {
                res.json({
                    status: 1,
                    message: 'ok',
                    data: result
                })
            }
        })
    },
    deleteOneMessage(req, res, next) {
        let _id = req.body._id
        Comment.findOneAndRemove({ _id: _id }, function(err, result) {
            if (err) {
                res.json({
                    status: 0,
                    message: err
                })
            } else {
                res.json({
                    status: 1,
                    message: 'ok',
                    data: result
                })
            }
        })
    }
}