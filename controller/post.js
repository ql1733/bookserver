const Post = require('../models/post.js')
const Comment = require('../models/comment.js')
const mongoose = require('mongoose')
module.exports = {
    create: function(req, res, next) {
        let post = {
            author: req.session.user._id,
            title: req.body.title,
            content: req.body.content,
            bookId: req.body.bookId,
            pv: 0
        }
        Post.create(post, (err, result) => {
            if (err) {
                res.json({
                    status: 0,
                    message: "发布失败"
                })
            } else {
                res.json({
                    status: 1,
                    message: "发布成功"
                })
            }
        })
    },
    getList: function(req, res, next) {
        // Post.find(null, null, { limit: 5 }, function(err, result) {
        //     if (err) {
        //         res.json({
        //             status: 0,
        //             message: err
        //         })
        //     } else {
        //         res.json({
        //             status: 1,
        //             message: "ok",
        //             data: result
        //         })
        //     }
        // })
        let bookId = req.body.id
        Post.find({ bookId: bookId }, null, { limit: 5, sort: { 'createdAt': -1 } })
            .populate({ path: 'author', select: 'name avator' })
            //.populate({ path: 'bookId', select: 'cBookName eBookName' })
            .exec(function(err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        message: err
                    })
                } else {
                    res.json({
                        status: 1,
                        message: "ok",
                        data: result
                    })
                }
            })
    },
    delectOnePost(req, res, next) {
        let id = req.body.id
        Post.remove({ _id: id }, function(err, result) {
            if (err) {
                res.json({
                    status: 0,
                    message: err
                })
            } else {
                //删除post关联评论
                // Comment.remove({ postId: id }, function(err, data) {
                //     if (err) {
                //         res.json({
                //             status: 0,
                //             message: err
                //         })
                //     } else {
                //         res.json({
                //             status: 1,
                //             message: data,
                //         })
                //     }
                // })
                res.json({
                    status: 1,
                    message: result,
                })

            }
        })
    },
    editPost(req, res, next) {
        let id = req.body.id
        let content = req.body.content
        Post.update({ _id: id }, { content: content }, { upsert: true }, function(err, result) {
            if (err) {
                res.json({
                    status: 0,
                    message: err
                })
            } else {
                res.json({
                    status: 1,
                    message: result
                })
            }
        })
    },
    getAllList:function(req,res,next){
        let keyWord = req.body.keyWord
        let start = (req.body.pageSize) * (req.body.currentPage - 1)
        let limit = req.body.pageSize
        let search = keyWord ? { '$or': [{ 'title': keyWord } , { 'author': keyWord }] } : {}
        Post.find(search)
            .skip(start).limit(limit).sort({ 'createdAt': -1 }).populate({path:'author',select:'name'}).exec(function(err, result) {
                if (err) {
                    res.json({
                        status: 0,
                        result: result
                    })
                } else {
                    res.json({
                        status: 1,
                        result: result
                    })
                }
            })
    }
}