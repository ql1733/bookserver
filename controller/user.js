const User = require('../models/user.js')
const mongoose = require('mongoose')
const formidable = require('formidable')
const path = require('path')
const url = require('url')
const qiniu = require('qiniu')
const fs = require('fs')
qiniu.conf.ACCESS_KEY = 'aVAZnrOFNacZPmjePoG07OhqiPjx49l6wEAEA7N3';
qiniu.conf.SECRET_KEY = 'J6pfPcxD4ln6ubuGtZn3fieNt3TXfvWOIvqQI2y8';
module.exports = {
    create: function(req, res, next) {
        let user = {
            name: req.body.name,
            password: req.body.password,
            avator: req.body.avator,
            gender: req.body.gender,
            bio: req.body.bio
        }
        User.create(user, (err, result) => {
            if (err) {
                res.json({
                    status: 0,
                    message: "注册失败"
                })
            } else {
                req.session.user = result
                res.json({
                    status: 1,
                    message: "注册成功",
                    data: result.name
                })
            }
        })
    },
    login: function(req, res, next) {
        let name = req.body.name
        let password = req.body.password
        User.findOne({ name: name }, function(err, result) {
            if (err) {
                res.json({
                    status: 0
                })
            } else {
                if (result) {
                    if (result.password == password) {
                        req.session.user = result
                        res.json({
                            status: 1,
                            message: '登录成功',
                            result: result
                        })
                    } else {
                        res.json({
                            status: 0,
                            message: '密码错误'
                        })
                    }
                } else {
                    res.json({
                        status: 0,
                        message: '用户不存在'
                    })
                }
            }
        })
    },
    loginOut: function(req, res, next) {
        let name = req.body.name
        User.findOne({ name: name }, function(err, result) {
            if (err) {
                res.json({
                    status: 0,
                    message: '登出失败'
                })
            } else {
                req.session.user = null
                res.json({
                    status: 1,
                    message: '登出成功'
                })
            }
        })
    },
    upload: function(req, res, next) {
        let queryUrl = url.parse(req.url, true, true)
        let name = req.session.user.name
        const form = formidable.IncomingForm()
        form.uploadDir = './public/img';
        let self = this
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
                            status: 0,
                            message: '上传失败'
                        })
                        fs.unlink(repath);
                        throw respErr;

                    }
                    if (respInfo.statusCode == 200) {
                        res.json({
                            status: 1,
                            message: '上传成功',
                            key: respBody
                        })
                        User.update({ name: name }, { avator: respBody.key }, { upsert: true }, function(err, result) {
                            if (err) {
                               // console.log(err)
                            } else {
                               // console.log(result)
                            }
                        })
                        fs.unlink(repath);
                    } else {
                        res.json({
                            status: 0,
                            message: '上传失败'
                        })
                        fs.unlink(repath);
                    }
                });

            } catch (err) {
                console.log('保存至七牛失败', err);
                fs.unlink(repath);
                // fs.unlink(files.file.path)
                // reject('保存至七牛失败')
            }
        })

    }

}