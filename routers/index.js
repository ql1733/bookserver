const createUser = require('./user')
const post = require('./post')
const comment = require('./comment')
const book = require('./book')
module.exports = function(app) {
    app.use('/user', createUser)
    app.use('/post', post)
    app.use('/comment', comment)
    app.use('/book', book)
}