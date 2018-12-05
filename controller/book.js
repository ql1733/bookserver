const Book = require('../models/book')
const formidable = require('formidable')
const path = require('path')
const url = require('url')
const qiniu = require('qiniu')
const fs = require('fs')
module.exports = {
    //录入书籍信息
    input: function(req, res, next) {
        let book = {
            eBookName: req.body.eBookName,
            cBookName: req.body.cBookName,
            publishTime: req.body.publishTime,
            author: req.body.author,
            press: req.body.press,
            buyTime: req.body.buyTime,
            edition: req.body.edition,
            isbn: req.body.isbn,
            img: ''
        }
        Book.create(book, (err, result) => {
            if (err) {
                res.json({
                    status: 0,
                    message: "录入失败"
                })
            } else {
                req.session.isbn = result.isbn
                res.json({
                    status: 1,
                    message: "录入成功",
                    result: result.isbn
                })
            }
        })
    },
    edit:function(req,res,next){
        // let book = {
        //     eBookName: req.body.eBookName,
        //     cBookName: req.body.cBookName,
        //     publishTime: req.body.publishTime,
        //     author: req.body.author,
        //     press: req.body.press,
        //     buyTime: req.body.buyTime,
        //     edition: req.body.edition,
        //     isbn: req.body.isbn,
        //     img: ''
        // }
        Book.update({isbn:req.body.isbn},
            {
            eBookName: req.body.eBookName,
            cBookName: req.body.cBookName,
            publishTime: req.body.publishTime,
            author: req.body.author,
            press: req.body.press,
            buyTime: req.body.buyTime,
            edition: req.body.edition,
            },
                {upsert: true },
                function(err,result){
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
    upload: function(req, res, next) {

        let queryUrl = url.parse(req.url, true, true)

        let isbn = req.session.isbn
            // console.log(user_id)
        const form = formidable.IncomingForm()
        form.uploadDir = './public/img';
        var accessKey = 'aVAZnrOFNacZPmjePoG07OhqiPjx49l6wEAEA7N3';
        var secretKey = 'J6pfPcxD4ln6ubuGtZn3fieNt3TXfvWOIvqQI2y8';
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);


        var options = {
            scope: 'book-read',
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var uploadToken = putPolicy.uploadToken(mac);
        var config = new qiniu.conf.Config();
        // 空间对应的机房
        config.zone = qiniu.zone.Zone_z0;
        form.parse(req, (err, fields, files) => {

            let formUploader = new qiniu.form_up.FormUploader(config);
            let putExtra = new qiniu.form_up.PutExtra();
            const imgName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16)
            const extname = path.extname(files.file.name)
            const repath = './public/img/' + imgName + extname
            try {
                const key = imgName + extname;
                fs.rename(files.file.path, repath);
                formUploader.putFile(uploadToken, key, repath, putExtra, function(respErr,
                    respBody, respInfo) {
                    if (respErr) {
                        res.json({
                            status: '0',
                            message: '上传失败'
                        })
                        fs.unlink(repath);
                        throw respErr;

                    }
                    if (respInfo.statusCode == 200) {

                        res.json({
                            status: '1',
                            message: '上传成功',
                            key: respBody
                        })
                        Book.update({ isbn: isbn }, { img: respBody.key }, { upsert: true }, function(err, result) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(result)
                            }
                        })
                        fs.unlink(repath);
                    } else {
                        console.log(respInfo.statusCode);
                        console.log(respBody);
                        res.json({
                            status: '0',
                            message: '上传失败'
                        })
                        fs.unlink(repath);
                    }
                });

            } catch (err) {
                console.log('保存至七牛失败', err);
                fs.unlink(repath);

            }
        })

    },
    list: function(req, res, next) {
        let keyWord = req.body.keyWord
        let start = (req.body.pageSize) * (req.body.currentPage - 1)
        let limit = req.body.pageSize
        let search = keyWord ? { '$or': [{ 'isbn': keyWord }, { 'author': keyWord }, { 'press': keyWord }, { 'cBookName': keyWord }, { 'publish': keyWord }] } : {}
        Book.find(search, { _id: 0 })
            .skip(start).limit(limit).sort({ 'publishTime': -1 }).exec(function(err, result) {
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
    },
    getDetail: function(req, res, next) {
        let id = req.body.id
        Book.findOne({ 'isbn': id }).exec(function(err, result) {
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