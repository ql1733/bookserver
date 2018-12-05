module.exports = {
    checkLogin: function(req, res, next) {
        if (!req.session.user) {
            return res.json({
                status: '0',
                message: '未登录'
            })
        }
        next()
    }
}